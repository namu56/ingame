import { Injectable } from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { CreateSideQuestDto } from './dto/create-side-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from './entities/quest.entity';
import { DataSource, Repository } from 'typeorm';
import { sideQuest } from './entities/side-quest.entity';

@Injectable()
export class QuestsService {
  constructor(
    private readonly questsService: QuestsService,
    @InjectRepository(Quest) private readonly questRepository: Repository<Quest>,
    @InjectRepository(sideQuest) private readonly sideQuestRepository: Repository<sideQuest>,
    private readonly dataSource: DataSource
  ) {}

  async create(id: number, createQuestDto: CreateQuestDto) {
    const currentDate = new Date();
    const { title, difficulty, mode, side, startDate, endDate, hidden, status } = createQuestDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const quest = this.questRepository.create({
        userId: id,
        title: title,
        difficulty: difficulty,
        mode: mode,
        startDate: startDate,
        endDate: endDate,
        hidden: hidden,
        status: status,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      const savedQuest = await queryRunner.manager.save(quest);

      for (const [idx, it] of side.entries()) {
        const { content } = it;
        const side = this.sideQuestRepository.create({
          id: idx,
          questId: savedQuest.id,
          content: content,
          status: 'on_progress',
          createdAt: currentDate,
          updatedAt: currentDate,
        });
        await queryRunner.manager.save(side);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return { message: 'success' };
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
