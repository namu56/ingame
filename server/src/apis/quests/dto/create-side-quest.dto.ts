import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../enums/quest.enum';

export class SideQuestItem {
  @IsNumber()
  @IsNotEmpty()
  public questId: number;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsEnum(Status)
  @IsNotEmpty()
  public status: Status;

  @IsDateString()
  @IsNotEmpty()
  public createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  public updatedAt: string;
}

export class CreateSideQuestDto {
  @IsArray()
  @IsNotEmpty()
  public quests: SideQuestItem[];
}
