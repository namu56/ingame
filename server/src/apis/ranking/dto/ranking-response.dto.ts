import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserResponseDto } from 'src/apis/users/dto/user-response.dto';

export class RankingResponseDto extends PickType(UserResponseDto, [
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
