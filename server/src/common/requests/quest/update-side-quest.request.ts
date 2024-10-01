import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSideQuestRequest {
  @ApiProperty({
    example: 1,
    description: '사이드 퀘스트 ID (새로운 사이드 퀘스트의 경우 없음)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    example: '사이드 퀘스트 1',
    description: '서브 퀘스트 내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  constructor() {}
}
