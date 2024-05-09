import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SideQuestItem } from './create-side-quest.dto';
import { Difficulty, isHidden, Mode, Status } from '../enums/quest.enum';

export class CreateQuestDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsEnum(Difficulty)
  @IsNotEmpty()
  public difficulty: Difficulty;

  @IsEnum(Mode)
  @IsNotEmpty()
  public mode: Mode;

  @IsArray()
  @IsNotEmpty()
  public side: SideQuestItem[];

  @IsDateString()
  @IsNotEmpty()
  public startDate: string; // YYYY-MM-DD 형식

  @IsDateString()
  @IsNotEmpty()
  public endDate: string; // YYYY-MM-DD 형식

  @IsEnum(isHidden)
  @IsNotEmpty()
  public hidden: isHidden;

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
