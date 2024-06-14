import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/configs/jwt.config';
import { LocalStrategy } from '../../core/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { GoogleStrategy } from '../../core/strategies/google.strategy';
import { OAuthController } from './controllers/oauth.controller';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => await JwtConfig(configService),
    }),
    CoreModule,
  ],
  controllers: [AuthController, OAuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
