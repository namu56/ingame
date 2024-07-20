import { Status } from '@common/types/quest/quest.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateQuestStatusRequest {
  @ApiProperty({
    enum: Status,
    example: 'onProgress',
    description: '퀘스트 진행 상태',
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
