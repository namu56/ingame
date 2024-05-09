import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findAll(id: number) {
    const quests = await this.questRepository.find({
      where: { userId: id },
      order: {
        id: 'DESC',
      },
      relations: ['side_quest'],
    });

    if (!quests) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }

  /*async findOne(userId: number, id: number) {
    const quests = await this.questRepository.find({
      where: { userId: userId, id: id },
      relations: ['side_quest'],
    });

    if (!quests) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }*/

  async update(userId: number, id: number, updateQuestDto: UpdateQuestDto) {
    const targetQuest = await this.questRepository.findOne({ where: { userId: userId, id: id } });

    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const updatedQuest = this.questRepository.merge(targetQuest, updateQuestDto);
    await this.questRepository.save(updatedQuest);
  }

  async remove(userId: number, id: number) {
    const targetQuest = await this.questRepository.findOne({ where: { userId: userId, id: id } });
    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    await this.questRepository.delete({ id: id });
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
