import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserProfileDto } from 'src/common/dto/user/user-profile.dto';

export class UserInfoWithRankDto extends PickType(UserProfileDto, [
  'id',
  'nickname',
  'point',
] as const) {
  @ApiProperty({
    example: 1,
    description: '순위',
    required: true,
  })
  rank: number;
}
