import { OmitType } from '@nestjs/mapped-types';
import { MainQuestResponse } from './main-quest.response';

export class SubQuestResponse extends OmitType(MainQuestResponse, ['sideQuests'] as const) {}
