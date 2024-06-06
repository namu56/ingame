import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, RefreshTokenPayload } from './auth.interface';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { CreateSnsUserDto } from '../users/dto/create-sns-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async validateSnsUser(createSnsUserDto: CreateSnsUserDto): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(createSnsUserDto.email);
    if (!user) return null;
    if (createSnsUserDto.provider !== user.provider) {
      throw new HttpException(
        `이 이메일은 이미 ${user.provider}계정을 통해 등록되었습니다.`,
        HttpStatus.CONFLICT
      );
    }
    return user;
  }

  async login(payload: AccessTokenPayload) {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload.id);
    const hasedRefreshToken = await this.encryptRefreshToken(refreshToken);
    await this.redis.set(`refreshToken:${payload.id}`, hasedRefreshToken, 'EX', 60 * 60 * 24 * 7);

    return { accessToken, refreshToken };
  }

  async logout(id: number): Promise<void> {
    await this.redis.del(`refreshToken:${id}`);
  }

  async refresh(refreshToken: string) {
    const secretKey = this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY');
    try {
      const decodedToken: RefreshTokenPayload = this.jwtService.verify(refreshToken, {
        secret: secretKey,
      });
      const user = await this.usersService.getUserById(decodedToken.id);
      const storedHashedToken = await this.redis.get(`refreshToken:${user.id}`);
      const isValid = await this.verifyRefreshToken(refreshToken, storedHashedToken);
      if (!isValid) {
        throw new UnauthorizedException();
      }

      const payload: AccessTokenPayload = { id: user.id, email: user.email };
      const newAccessToken = await this.generateAccessToken(payload);
      const newRefreshToken = await this.generateRefreshToken(payload.id);

      const newHashedRefreshToken = await this.encryptRefreshToken(newRefreshToken);
      await this.redis.set(
        `refreshToken:${user.id}`,
        newHashedRefreshToken,
        'EX',
        60 * 60 * 24 * 7
      );

      return { newAccessToken, newRefreshToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const payload: RefreshTokenPayload = { id: userId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  private async encryptRefreshToken(refreshToken: string): Promise<string> {
    const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(refreshToken, salt);
  }

  private async verifyRefreshToken(
    refreshToken: string,
    hasedRefreshToken: string
  ): Promise<boolean> {
    return bcrypt.compare(refreshToken, hasedRefreshToken);
  }
}
