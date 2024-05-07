import { ConfigService } from '@nestjs/config';

export const JwtConfig = async (configService: ConfigService) => {
  return {
    secret: configService.get<string>('SECRET_KEY'),
    signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') },
  };
};
