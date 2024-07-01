import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSocialUserRequest {
  @IsNotEmpty()
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

  constructor(email: string, provider: string, providerId: string, nickname: string) {
    this.email = email;
    this.provider = provider;
    this.providerId = providerId;
    this.nickname = nickname;
  }
}
