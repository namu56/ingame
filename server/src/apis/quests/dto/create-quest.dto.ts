import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateSideQuestDto } from './create-side-quest.dto';
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
  public side: CreateSideQuestDto[];

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
  public status: Status;

  @IsDateString()
  public createdAt: string;

  @IsDateString()
  public updatedAt: string;
}
