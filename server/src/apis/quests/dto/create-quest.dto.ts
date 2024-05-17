import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  CreateSideQuestDto,
  SideQuestRequestDto,
  SideQuestResponseDto,
  UpdateSideQuestRequestDto,
} from './create-side-quest.dto';
import { Difficulty, isHidden, Mode, Status } from '../enums/quest.enum';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class CreateQuestDto {
  @ApiProperty({
    example: '퀘스트 1',
    description: '퀘스트 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    enum: Difficulty,
    example: 'NORMAL',
    description: '퀘스트 난이도',
    required: true,
  })
  @IsEnum(Difficulty)
  @IsNotEmpty()
  public difficulty: Difficulty;

  @ApiProperty({
    enum: Mode,
    example: 'MAIN',
    description: '퀘스트 모드 (서브 퀘스트는 EASY 고정)',
    required: true,
  })
  @IsEnum(Mode)
  @IsNotEmpty()
  public mode: Mode;

  @ApiProperty({
    type: [SideQuestResponseDto],
    example: [
      {
        id: 1,
        content: '사이드 퀘스트 1',
        status: 'ON_PROGRESS',
        createdAt: '2024-05-15',
        updatedAt: '2024-05-23',
      },
      {
        id: 2,
        content: '사이드 퀘스트 2',
        status: 'ON_PROGRESS',
        createdAt: '2024-05-15',
        updatedAt: '2024-05-19',
      },
    ],
    description: '퀘스트 설명 (메인 퀘스트 전용)',
    required: false,
  })
  @IsArray()
  public side: CreateSideQuestDto[];

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 시작일 (YYYY-MM-DD 형식)',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  public startDate: string; // YYYY-MM-DD 형식

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 종료일 (YYYY-MM-DD 형식)',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  public endDate: string; // YYYY-MM-DD 형식

  @ApiProperty({
    enum: isHidden,
    example: 'FALSE',
    description: '퀘스트 숨김 여부',
    required: true,
  })
  @IsEnum(isHidden)
  @IsNotEmpty()
  public hidden: isHidden;

  @ApiProperty({
    enum: Status,
    example: 'ON_PROGRESS',
    description: '퀘스트 진행 상태 (생성 시에는 ON_PROGRESS 로 고정)',
    required: true,
  })
  @IsEnum(Status)
  public status: Status;

  @ApiProperty({
    example: '2024-05-15',
    description: '퀘스트 생성일',
    required: true,
  })
  @IsDateString()
  public createdAt: string;

  @ApiProperty({
    example: '2024-05-25',
    description: '퀘스트 최종 수정일',
    required: true,
  })
  @IsDateString()
  public updatedAt: string;
}

export class CreateQuestRequestDto extends OmitType(CreateQuestDto, [
  'status',
  'side',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({
    type: [OmitType(SideQuestRequestDto, ['questId'])],
    example: [
      {
        content: '사이드 퀘스트 1',
      },
      {
        content: '사이드 퀘스트 2',
      },
    ],
    description: '퀘스트 설명 (메인 퀘스트 전용)',
    required: false,
  })
  public side: Omit<SideQuestRequestDto, 'questId'>[];
}

export class UpdateQuestRequestDto extends OmitType(CreateQuestDto, [
  'mode',
  'side',
  'status',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({
    type: [UpdateSideQuestRequestDto],
    example: [
      {
        id: 1,
        content: '사이드 퀘스트 1',
        status: 'ON_PROGRESS',
      },
      {
        id: 2,
        content: '사이드 퀘스트 2',
        status: 'ON_PROGRESS',
      },
    ],
    description: '사이드 퀘스트',
  })
  public side: UpdateSideQuestRequestDto[];
}

export class UpdateSubQuestRequestDto extends PickType(CreateQuestDto, ['title', 'hidden']) {}

export class SubQuestResponseDto extends PickType(CreateQuestDto, ['title', 'hidden', 'status']) {
  @ApiProperty({ example: 1, description: '퀘스트 ID', required: true })
  public id: number;
}
