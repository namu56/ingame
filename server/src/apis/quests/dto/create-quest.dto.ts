import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { SideQuestItem } from './create-side-quest.dto';

export class CreateQuestDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString({ groups: ['easy', 'normal', 'hard'] })
  @IsNotEmpty()
  public difficulty: string;

  @IsString({ groups: ['main', 'sub'] })
  @IsNotEmpty()
  public mode: string;

  @IsArray()
  @IsNotEmpty()
  public side: SideQuestItem[];

  @IsDateString()
  @IsNotEmpty()
  public startDate: string; // YYYY-MM-DD 형식

  @IsDateString()
  @IsNotEmpty()
  public endDate: string; // YYYY-MM-DD 형식

  @IsString({ groups: ['true', 'false'] })
  @IsNotEmpty()
  public hidden: string;

  @IsString({ groups: ['completed', 'fail', 'on_progress'] })
  @IsNotEmpty()
  public status: string;

  @IsDateString()
  @IsNotEmpty()
  public createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  public updatedAt: string;
}
