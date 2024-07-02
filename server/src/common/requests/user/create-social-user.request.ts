import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserProvider } from 'src/common/types/user/user.type';

export class CreateSocialUserRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserProvider)
  provider: UserProvider;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  constructor(email: string, provider: UserProvider, providerId: string, nickname: string) {
    this.email = email;
    this.provider = provider;
    this.providerId = providerId;
    this.nickname = nickname;
  }
}
