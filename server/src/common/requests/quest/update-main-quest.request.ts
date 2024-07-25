import { Difficulty, Hidden } from '@common/types/quest/quest.type';
import { toUTCEndOfDay, toUTCStartOfDay } from '@common/utils/date.util';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UpdateSideQuestRequest } from './update-side-quest.request';
import { TransformDateToUTC } from '@core/decorators/transform-date-to-utc.decorator';

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
    description: '사이드 퀘스트의 내용들',
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
  @TransformDateToUTC({ option: 'start' })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 종료일',
    required: true,
  })
  @TransformDateToUTC({ option: 'end' })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  constructor() {}
}
