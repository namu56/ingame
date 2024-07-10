import { Status } from '@common/types/quest/quest.type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePointRequest {
  @ApiProperty({
    example: 1,
    description: '퀘스트의 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  questId: number;

  @ApiProperty({
    example: 'COMPLETED',
    description: '완료 또는 진행중',
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
