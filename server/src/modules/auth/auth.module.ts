import { ClassProvider, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AUTH_SERVICE_KEY } from './interfaces/auth-service.interface';
import { AuthController, OAuthController } from './controllers';

const authService: ClassProvider = {
  provide: AUTH_SERVICE_KEY,
  useClass: AuthService,
};

@Module({
  imports: [UserModule],
  providers: [authService],
  controllers: [AuthController, OAuthController],
  exports: [authService],
})
export class AuthModule {}
