import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from './entities/quest.entity';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { SideQuest } from './entities/side-quest.entity';
import { Difficulty, Mode, Status } from './enums/quest.enum';

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest) private readonly questRepository: Repository<Quest>,
    @InjectRepository(SideQuest) private readonly sideQuestRepository: Repository<SideQuest>,
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
        difficulty: mode === Mode.Main ? difficulty : Difficulty.Default,
        mode: mode,
        startDate: startDate,
        endDate: endDate,
        hidden: hidden,
        status: status ? status : Status.onProgress,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      const savedQuest = await queryRunner.manager.save(quest);

      if (mode === Mode.Main) {
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

  async findAll(id: number, mode: Mode, queryDate?: Date) {
    const mainOptions: FindManyOptions<Quest> = {
      where: { userId: id, mode: Mode.Main },
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
    };
    const subOptions: FindManyOptions<Quest> = {
      where: { userId: id, mode: Mode.Sub, startDate: queryDate },
      order: {
        id: 'DESC',
      },
      select: ['id', 'title', 'hidden', 'status', 'createdAt', 'updatedAt'],
    };
    const quests = await this.questRepository.find(mode === Mode.Main ? mainOptions : subOptions);

    if (quests.length === 0) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }

  async update(userId: number, id: number, updateQuestDto: UpdateQuestDto) {
    const currentDate = new Date();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetQuest = await this.questRepository.findOne({ where: { userId: userId, id: id } });
      const targetSideQuest = await this.sideQuestRepository.find({ where: { questId: id } });

      if (!targetQuest) {
        throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
      }

      const updatedQuest = this.questRepository.merge(targetQuest, {
        ...updateQuestDto,
        updatedAt: currentDate,
      });
      await queryRunner.manager.save(updatedQuest);

      if (updateQuestDto.side) {
        const deleteSideQuestList = targetSideQuest
          .filter((it) => !updateQuestDto.side.some((side) => side.id === it.id))
          .map((it) => it.id);
        const updateSideQuestList = updateQuestDto.side.filter((it) => it.id);

        for (const quest of updateSideQuestList) {
          const targetQuest = await this.sideQuestRepository.findOne({
            where: { id: quest.id },
          });
          if (!targetQuest) {
            throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
          }

          const updatedQuest = this.sideQuestRepository.merge(targetQuest, {
            ...updateQuestDto,
            updatedAt: currentDate,
          });
          await queryRunner.manager.save(updatedQuest);
        }

        for (const questId of deleteSideQuestList) {
          const targetQuest = await this.sideQuestRepository.findOne({
            where: { id: questId },
          });
          if (!targetQuest) {
            throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
          }

          await queryRunner.manager.delete(SideQuest, { id: questId });
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(userId: number, id: number) {
    const targetQuest = await this.questRepository.findOne({ where: { userId: userId, id: id } });
    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    await this.questRepository.delete({ id: id });
  }

  async updateSideStatus(userId: number, id: number, updateQuestDto: UpdateSideQuestDto) {
    const currentDate = new Date();

    const targetQuest = await this.sideQuestRepository.findOne({
      where: { id: id },
    });
    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const quest = await this.questRepository.find({
      where: { id: updateQuestDto.questId, userId: userId },
    });
    if (!quest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const updatedQuest = this.sideQuestRepository.merge(targetQuest, {
      status: updateQuestDto.status,
      updatedAt: currentDate,
    });
    await this.sideQuestRepository.save(updatedQuest);
  }
}
