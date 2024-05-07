import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SideQuestItem {
  @IsNumber()
  @IsNotEmpty()
  public questId: number;

  @IsString()
  @IsNotEmpty()
  public content: string;

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

export class CreateSideQuestDto {
  @IsArray()
  @IsNotEmpty()
  public quests: SideQuestItem[];
}
