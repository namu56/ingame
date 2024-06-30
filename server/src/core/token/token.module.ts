import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/configs/jwt.config';
import { TOKEN_SERVICE_KEY } from './interfaces/token-service.interface';
import { TokenService } from './token.service';

const tokenService: Provider = {
  provide: TOKEN_SERVICE_KEY,
  useClass: TokenService,
};

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: JwtConfig,
    }),
  ],
  providers: [tokenService],
  exports: [JwtModule, tokenService],
})
export class TokenModule {}
