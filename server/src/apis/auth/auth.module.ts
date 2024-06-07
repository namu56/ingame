import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/common/config/jwt.config';
import { AuthGuard } from './guards/auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { OAuthController } from './controllers/oauth.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => await JwtConfig(configService),
    }),
    CommonModule,
  ],
  controllers: [AuthController, OAuthController],
  providers: [AuthService, AuthGuard, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
