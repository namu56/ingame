import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSideQuestRequest {
  @ApiProperty({
    example: 1,
    description: '사이드 퀘스트 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

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
