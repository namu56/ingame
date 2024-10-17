import { ClassProvider, Module } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY_KEY } from './refresh-token-repository.interface';
import { RefreshTokenRepository } from './refresh-token.repository';

export const refreshTokenRepository: ClassProvider = {
  provide: REFRESH_TOKEN_REPOSITORY_KEY,
  useClass: RefreshTokenRepository,
};

@Module({
  providers: [refreshTokenRepository],
  exports: [refreshTokenRepository],
})
export class RefreshTokenRepositoryModule {}
