import { Difficulty, Hidden, Mode } from '@common/types/quest/quest.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { CreateSideQuestRequest } from './create-side-quest.request';
import { IsOnlyDate } from '@core/decorators/is-only-date.decorator';

export class CreateQuestRequest {
  @ApiProperty({
    example: '퀘스트 1',
    description: '퀘스트 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: Difficulty,
    example: 'NORMAL',
    description: '퀘스트 난이도',
    required: true,
  })
  @IsEnum(Difficulty)
  @ValidateIf((quest) => quest.mode === Mode.Main)
  @IsNotEmpty()
  difficulty: Difficulty;

  @ApiProperty({
    enum: Mode,
    example: 'main',
    description: '퀘스트 모드',
    required: true,
  })
  @IsEnum(Mode)
  @IsNotEmpty()
  mode: Mode;

  @ApiProperty({
    enum: Hidden,
    example: 'FALSE',
    description: '퀘스트 숨김 여부',
    required: true,
  })
  @IsEnum(Hidden)
  @IsNotEmpty()
  hidden: Hidden;

  @ApiProperty({
    type: [CreateSideQuestRequest],
    description: '사이드 퀘스트의 내용들',
    required: false,
  })
  @ValidateIf((quest) => quest.mode === Mode.Main)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSideQuestRequest)
  sideQuests: CreateSideQuestRequest[];

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
