import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export const hashPassword = async (
  password: string,
  configService: ConfigService
): Promise<string> => {
  const saltRounds = parseInt(configService.get<string>('SALT_ROUNDS'));
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};
