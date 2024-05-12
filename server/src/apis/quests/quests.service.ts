import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { CreateSideQuestDto } from './dto/create-side-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from './entities/quest.entity';
import { DataSource, Repository } from 'typeorm';
import { sideQuest } from './entities/side-quest.entity';
import { Status } from './enums/quest.enum';

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
        status: status ? status : Status.onProgress,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      const savedQuest = await queryRunner.manager.save(quest);

      for (const it of side) {
        const { content } = it;
        const side = this.sideQuestRepository.create({
          questId: savedQuest.id,
          content: content,
          status: Status.onProgress,
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
  }

  async findAll(id: number) {
    const quests = await this.questRepository.find({
      where: { userId: id },
      order: {
        id: 'DESC',
      },
      relations: ['sideQuests'],
      select: [
        'id',
        'title',
        'difficulty',
        'mode',
        'startDate',
        'endDate',
        'hidden',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });

    if (quests.length === 0) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }

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

  async createSide(id: number, createQuestDto: CreateSideQuestDto[]) {
    const currentDate = new Date();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const it of createQuestDto) {
        const { questId, content, status, createdAt, updatedAt } = it;

        const quest = await this.questRepository.find({ where: { id: questId, userId: id } });
        if (quest.length === 0) {
          throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
        }

        const side = this.sideQuestRepository.create({
          questId: questId,
          content: content,
          status: status ? status : Status.onProgress,
          createdAt: createdAt ? new Date(createdAt) : currentDate,
          updatedAt: updatedAt ? new Date(updatedAt) : currentDate,
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

  async updateSide(userId: number, id: number, updateQuestDto: UpdateSideQuestDto) {
    const quest = await this.questRepository.findOne({
      where: { userId: userId, id: updateQuestDto.questId },
    });
    if (!quest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const targetQuest = await this.sideQuestRepository.findOne({
      where: { id: id, questId: quest.id },
    });
    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const updatedQuest = this.sideQuestRepository.merge(targetQuest, updateQuestDto);
    await this.questRepository.save(updatedQuest);
  }

  async removeSide(userId: number, id: number) {
    const targetQuest = await this.sideQuestRepository.findOne({
      where: { id: id },
    });
    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    await this.questRepository.delete({ id: id });
  }
}
