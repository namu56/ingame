import { Difficulty, Hidden } from '@common/types/quest/quest.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UpdateSideQuestRequest } from './update-side-quest.request';
import { IsOnlyDate } from '@core/decorators/is-only-date.decorator';

export class UpdateMainQuestRequest {
  @ApiProperty({
    example: '퀘스트 1',
    description: '퀘스트 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    enum: Difficulty,
    example: 'normal',
    description: '퀘스트 난이도',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({
    enum: Hidden,
    example: 'FALSE',
    description: '퀘스트 숨김 여부',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Hidden)
  hidden: Hidden;

  @ApiProperty({
    type: [UpdateSideQuestRequest],
    description: '사이드 퀘스트의 내용들 (새로운 사이드 퀘스트는 id 없이 content만 포함)',
    required: false,
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => UpdateSideQuestRequest)
  sideQuests: UpdateSideQuestRequest[];

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 시작일',
    required: true,
  })
  @IsNotEmpty()
  @IsOnlyDate()
  startDate: string;

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 종료일',
    required: true,
  })
  @IsNotEmpty()
  @IsOnlyDate()
  endDate: string;

  constructor() {}
}
