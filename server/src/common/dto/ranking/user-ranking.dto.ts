import { ApiProperty } from '@nestjs/swagger';
import { UserInfoWithRankDto } from './user-info-with-rank.dto';

export class UserRankingDto extends UserInfoWithRankDto {
  @ApiProperty({
    example: 1,
    description: '레벨',
    required: true,
  })
  level: number;
}
