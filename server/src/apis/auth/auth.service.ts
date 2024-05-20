import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, RefreshTokenPayload } from './auth.interface';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserProfileDto } from '../users/dto/user-profile.dto';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.getUserByEmail(email);
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!user || !verifyPassword) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);
    const hasedRefreshToken = await this.encryptRefreshToken(refreshToken);
    await this.redis.set(`refreshToken:${user.id}`, hasedRefreshToken, 'EX', 60 * 60 * 24 * 7);

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
      if (!user) {
        throw new UnauthorizedException();
      }

      const storedHashedToken = await this.redis.get(`refreshToken:${user.id}`);
      const isValid = await this.verifyRefreshToken(refreshToken, storedHashedToken);
      if (!isValid) {
        throw new UnauthorizedException();
      }

      const newAccessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user.id);

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

  private async generateAccessToken(user: User | UserProfileDto): Promise<string> {
    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const payload: RefreshTokenPayload = {
      id: userId,
    };

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
