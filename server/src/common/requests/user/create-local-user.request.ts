import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateLocalUserRequest {
  @ApiProperty({
    example: 'test@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'qwer1234',
    description: '8 ~ 30 이하 비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @Length(8, 30)
  password: string;

  @ApiProperty({
    example: 'InGame',
    description: '2 ~ 30 이하 닉네임',
    required: true,
  })
  @IsNotEmpty()
  @Length(2, 20)
  nickname: string;
}
