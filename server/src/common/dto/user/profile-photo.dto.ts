import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProfilePhotoDto {
  @ApiProperty({
    description: '프로필 이미지 스트링 형태의 데이터',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profilePhoto: string;
}
