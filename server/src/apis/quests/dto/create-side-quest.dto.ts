import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../enums/quest.enum';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class CreateSideQuestDto {
  @ApiProperty({
    example: 1,
    description: '사이드 퀘스트 ID',
    required: false,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    example: 1,
    description: '메인 퀘스트 ID',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public questId: number;

  @ApiProperty({
    example: '사이드 퀘스트 1',
    description: '서브 퀘스트 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public content: string;

  @ApiProperty({
    enum: Status,
    example: 'ON_PROGRESS',
    description: '퀘스트 상태 (생성 시에는 ON_PROGRESS 로 고정)',
    required: false,
  })
  @IsEnum(Status)
  public status: Status;

  @ApiProperty({
    example: '2024-05-15',
    description: '생성일 (YYYY-MM-DD 형식)',
    required: false,
  })
  @IsDateString()
  public createdAt: string;

  @ApiProperty({
    example: '2024-05-15',
    description: '수정일 (YYYY-MM-DD 형식)',
    required: false,
  })
  @IsDateString()
  public updatedAt: string;
}

export class SideQuestResponseDto extends OmitType(CreateSideQuestDto, ['questId']) {
  @ApiProperty({
    example: 1,
    description: '사이드 퀘스트 ID',
    required: true,
  })
  public id: number;
}

export class SideQuestRequestDto extends OmitType(CreateSideQuestDto, [
  'status',
  'createdAt',
  'updatedAt',
]) {}

export class UpdateSideQuestRequestDto extends PickType(CreateSideQuestDto, ['status']) {}
