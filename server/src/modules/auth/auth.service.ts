import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, AuthTokens, RefreshTokenPayload } from './auth.interface';
import { User } from '../../entities/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { CreateSnsUserDto } from '../../common/dto/user/create-sns-user.dto';
import { compareValue } from 'src/common/utils/compare-value.util';
import { encryptValue } from 'src/common/utils/encrypt-value.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async validateSnsUser(createSnsUserDto: CreateSnsUserDto): Promise<User | null> {
    const user = await this.userService.getUserByEmail(createSnsUserDto.email);
    if (!user) return null;
    if (createSnsUserDto.provider !== user.provider) {
      throw new HttpException(
        `이 이메일은 이미 ${user.provider}계정을 통해 등록되었습니다.`,
        HttpStatus.CONFLICT
      );
    }
    return user;
  }

  async login(payload: AccessTokenPayload): Promise<AuthTokens> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload.id);

    const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
    const hasedRefreshToken = await encryptValue(refreshToken, saltRounds);
    await this.redis.set(`refreshToken:${payload.id}`, hasedRefreshToken, 'EX', 60 * 60 * 24 * 7);

    return { accessToken, refreshToken };
  }

  async logout(id: number): Promise<void> {
    await this.redis.del(`refreshToken:${id}`);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const secretKey = this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY');
    try {
      const decodedToken: RefreshTokenPayload = this.jwtService.verify(refreshToken, {
        secret: secretKey,
      });
      const user = await this.userService.getUserById(decodedToken.id);
      const storedHashedToken = await this.redis.get(`refreshToken:${user.id}`);
      const isValid = await compareValue(refreshToken, storedHashedToken);
      if (!isValid) {
        throw new UnauthorizedException();
      }

      const payload: AccessTokenPayload = { id: user.id, email: user.email };
      const newAccessToken = await this.generateAccessToken(payload);
      const newRefreshToken = await this.generateRefreshToken(payload.id);

      const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
      const newHashedRefreshToken = await encryptValue(refreshToken, saltRounds);
      await this.redis.set(
        `refreshToken:${user.id}`,
        newHashedRefreshToken,
        'EX',
        60 * 60 * 24 * 7
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
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
}
