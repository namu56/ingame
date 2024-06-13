import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSnsUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  provider: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;
}
