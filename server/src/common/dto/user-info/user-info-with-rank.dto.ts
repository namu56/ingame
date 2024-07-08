import { ApiProperty } from '@nestjs/swagger';

export class UserInfoWithRankDto {
  @ApiProperty({
    example: 1,
    description: 'id',
    required: true,
  })
  id: number;

  @ApiProperty({
    example: 'test',
    description: '닉네임',
    required: true,
  })
  nickname: string;

  @ApiProperty({
    example: 0,
    description: '포인트 점수',
    required: true,
  })
  point: number;

  @ApiProperty({
    example: 1,
    description: '순위',
    required: true,
  })
  rank: number;
}
