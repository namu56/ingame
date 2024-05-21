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

  async create(userId: number, createQuestDto: CreateQuestDto) {
    const currentDate = new Date();
    const { title, difficulty, mode, sideQuests, startDate, endDate, hidden, status } =
      createQuestDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const quest = this.questRepository.create({
        userId: userId,
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
        for (const sideQuest of sideQuests) {
          const { content } = sideQuest;

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

  async findAll(userId: number, mode: Mode, queryDate: string) {
    const mainOptions: FindManyOptions<Quest> = {
      where: { userId: userId, mode: Mode.Main, startDate: queryDate },
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
      where: { userId: userId, mode: Mode.Sub, startDate: queryDate },
      order: {
        id: 'DESC',
      },
      select: ['id', 'title', 'hidden', 'status', 'createdAt', 'updatedAt'],
    };
    const quests = await this.questRepository.find(mode === Mode.Main ? mainOptions : subOptions);

    if (!quests) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }

  async findOne(userId: number, questId: number) {
    const options: FindManyOptions<Quest> = {
      where: { id: questId, userId: userId, mode: Mode.Main },
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

    const quests = await this.questRepository.find(options);

    if (!quests) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }

  async update(userId: number, questId: number, updateQuestDto: UpdateQuestDto) {
    const currentDate = new Date();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetQuest = await this.questRepository.findOne({
        where: { userId: userId, id: questId },
      });
      const targetSideQuest = await this.sideQuestRepository.find({ where: { questId: questId } });

      if (!targetQuest) {
        throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
      }

      const updatedQuest = this.questRepository.merge(targetQuest, {
        difficulty: updateQuestDto.difficulty,
        title: updateQuestDto.title,
        startDate: updateQuestDto.startDate,
        endDate: updateQuestDto.endDate,
        hidden: updateQuestDto.hidden,
        updatedAt: currentDate,
      });
      await queryRunner.manager.save(updatedQuest);

      if (updateQuestDto.sideQuests) {
        const deleteSideQuestIdList = targetSideQuest
          .filter(
            (sideQuest) =>
              !updateQuestDto.sideQuests.some((sideQuestItem) => sideQuestItem.id === sideQuest.id)
          )
          .map((sideQuest) => sideQuest.id);
        const updateSideQuestList = updateQuestDto.sideQuests.filter((it) => it.id);

        for (const sideQuest of updateSideQuestList) {
          const targetSideQuest = await this.sideQuestRepository.findOne({
            where: { id: sideQuest.id, questId: questId },
          });
          if (!targetSideQuest) {
            throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
          }

          const updatedQuest = this.sideQuestRepository.merge(targetSideQuest, {
            id: sideQuest.id,
            content: sideQuest.content,
            status: sideQuest.status,
            updatedAt: currentDate,
          });
          await queryRunner.manager.save(updatedQuest);
        }

        for (const sideQuestId of deleteSideQuestIdList) {
          const targetSideQuest = await this.sideQuestRepository.findOne({
            where: { id: sideQuestId },
          });
          if (!targetSideQuest) {
            throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
          }

          await queryRunner.manager.delete(SideQuest, { id: sideQuestId });
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

  async remove(userId: number, questId: number) {
    const targetQuest = await this.questRepository.findOne({
      where: { userId: userId, id: questId },
    });
    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    await this.questRepository.delete({ id: questId });
  }

  async updateSideStatus(userId: number, questId: number, updateQuestDto: UpdateSideQuestDto) {
    const currentDate = new Date();

    const targetSideQuest = await this.sideQuestRepository.findOne({
      where: { id: questId },
    });
    if (!targetSideQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const quest = await this.questRepository.find({
      where: { id: updateQuestDto.questId, userId: userId },
    });
    if (!quest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const updatedSideQuest = this.sideQuestRepository.merge(targetSideQuest, {
      status: updateQuestDto.status,
      updatedAt: currentDate,
    });
    await this.sideQuestRepository.save(updatedSideQuest);
  }
}
