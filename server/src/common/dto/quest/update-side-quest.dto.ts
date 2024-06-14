import { PartialType } from '@nestjs/mapped-types';
import { CreateSideQuestDto } from './create-side-quest.dto';

export class UpdateSideQuestDto extends PartialType(CreateSideQuestDto) {}
