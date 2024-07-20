import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSideQuestRequest {
  @ApiProperty({
    example: '사이드 퀘스트',
    description: '사이드 퀘스트의 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
