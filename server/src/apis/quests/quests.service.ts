import { Injectable } from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { CreateSideQuestDto } from './dto/create-side-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';

@Injectable()
export class QuestsService {
  create(createQuestDto: CreateQuestDto) {
    return 'This action adds a new quest';
  }

  findAll() {
    return `This action returns all quests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quest`;
  }

  update(id: number, updateQuestDto: UpdateQuestDto) {
    return `This action updates a #${id} quest`;
  }

  remove(id: number) {
    return `This action removes a #${id} quest`;
  }

  createSide(createQuestDto: CreateSideQuestDto) {
    return 'This action adds a new quest';
  }

  updateSide(id: number, updateQuestDto: UpdateSideQuestDto) {
    return `This action updates a #${id} quest`;
  }

  removeSide(id: number) {
    return `This action removes a #${id} quest`;
  }
}
