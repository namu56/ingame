import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserProfileDto } from 'src/apis/users/dto/user-profile.dto';

export class UserRankingDto extends PickType(UserProfileDto, ['id', 'nickname', 'point'] as const) {
  @ApiProperty({
    example: 1,
    description: '순위',
    required: true,
  })
  rank: number;
}
