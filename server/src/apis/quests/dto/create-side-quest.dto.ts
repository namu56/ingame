import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../enums/quest.enum';

export class CreateSideQuestDto {
  @IsNumber()
  @IsNotEmpty()
  public questId: number;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsEnum(Status)
  public status: Status;

  @IsDateString()
  public createdAt: string;

  @IsDateString()
  public updatedAt: string;
}
