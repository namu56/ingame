import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({
    example: 'InGame',
    description: '2 ~ 30 이하 닉네임',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  nickname: string;

  @ApiProperty({
    example: '자기소개입니다.',
    description: '0 ~ 50 이하 자기소개 글',
    required: false,
  })
  @IsString()
  @Length(0, 50)
  intro: string;
}
