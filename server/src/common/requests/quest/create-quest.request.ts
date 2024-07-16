import { Difficulty, Hidden, Mode, Status } from '@common/types/quest/quest.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateSideQuestRequest } from './create-side-quest.request';

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
    example: 'normal',
    description: '퀘스트 난이도',
    required: true,
  })
  @IsEnum(Difficulty)
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
    enum: Status,
    example: 'onProgress',
    description: '퀘스트 진행 상태',
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

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
  @ValidateIf((quest) => quest.mode === Mode.MAIN)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSideQuestRequest)
  sideQuests: CreateSideQuestRequest[];

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 시작일',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string; // YYYY-MM-DD 형식

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 종료일',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string; // YYYY-MM-DD 형식
}
