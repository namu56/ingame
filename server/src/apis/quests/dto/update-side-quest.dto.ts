import { PartialType } from '@nestjs/mapped-types';
import { SideQuestItem } from './create-side-quest.dto';

export class UpdateSideQuestDto extends PartialType(SideQuestItem) {}
