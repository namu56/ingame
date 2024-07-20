import { Hidden } from '@common/types/quest/quest.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSubQuestRequest {
  @ApiProperty({
    example: '퀘스트 1',
    description: '퀘스트 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    enum: Hidden,
    example: 'FALSE',
    description: '퀘스트 숨김 여부',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Hidden)
  hidden: Hidden;
}
