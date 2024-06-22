import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    example: 1,
    description: 'id',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: 'test@gmail.com',
    description: '이메일',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'test',
    description: '닉네임',
    required: true,
  })
  nickname: string;

  @ApiProperty({
    example: null,
    description: '자기소개',
    required: false,
  })
  intro: string | null;

  @ApiProperty({
    example: null,
    description: '프로필 사진',
    required: false,
  })
  profilePhotoUrl: string | null;

  @ApiProperty({
    example: 0,
    description: '포인트 점수',
    required: true,
  })
  point: number;

  @ApiProperty({
    example: 1,
    description: '레벨',
    required: true,
  })
  level: number;
}
