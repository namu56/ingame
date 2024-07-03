import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestDto } from '../../common/dto/quest/create-quest.dto';
import { UpdateQuestDto } from '../../common/dto/quest/update-quest.dto';
import { UpdateSideQuestDto } from '../../common/dto/quest/update-side-quest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from '../../entities/quest/quest.entity';
import { DataSource, FindManyOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SideQuest } from '../../entities/side-quest/side-quest.entity';
import { Difficulty, Mode, Status } from '../../common/types/quest/quest.type';

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
        difficulty: mode === Mode.MAIN ? difficulty : Difficulty.DEFAULT,
        mode: mode,
        start: startDate,
        end: endDate,
        hidden: hidden,
        status: status ? status : Status.ON_PROGRESS,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      const savedQuest = await queryRunner.manager.save(quest);

      if (mode === Mode.MAIN) {
        for (const sideQuest of sideQuests) {
          const { content } = sideQuest;

          const side = this.sideQuestRepository.create({
            questId: savedQuest.id,
            content: content,
            status: Status.ON_PROGRESS,
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
      where: {
        userId: userId,
        mode: Mode.MAIN,
        start: LessThanOrEqual(queryDate),
        end: MoreThanOrEqual(queryDate),
      },
      order: {
        id: 'DESC',
      },
      relations: ['sideQuests'],
      select: [
        'id',
        'title',
        'difficulty',
        'mode',
        'start',
        'end',
        'hidden',
        'status',
        'createdAt',
        'updatedAt',
      ],
    };
    const subOptions: FindManyOptions<Quest> = {
      where: { userId: userId, mode: Mode.SUB, start: queryDate },
      order: {
        id: 'DESC',
      },
      select: ['id', 'title', 'hidden', 'status', 'createdAt', 'updatedAt'],
    };
    const quests = await this.questRepository.find(mode === Mode.MAIN ? mainOptions : subOptions);

    if (!quests) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }

  async findOne(userId: number, questId: number) {
    const options: FindManyOptions<Quest> = {
      where: { id: questId, userId: userId, mode: Mode.MAIN },
      order: {
        id: 'DESC',
      },
      relations: ['sideQuests'],
      select: [
        'id',
        'title',
        'difficulty',
        'mode',
        'start',
        'end',
        'hidden',
        'status',
        'createdAt',
        'updatedAt',
      ],
    };

    const quests = await this.questRepository.findOne(options);

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

      if (!targetQuest) {
        throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
      }

      const updatedQuest = this.questRepository.merge(targetQuest, {
        ...updateQuestDto,
        updatedAt: currentDate,
      });
      await queryRunner.manager.save(updatedQuest);

      if (updateQuestDto.sideQuests) {
        const targetSideQuests = await this.sideQuestRepository.find({
          where: { questId: questId },
        });
        const updateSideQuestList = updateQuestDto.sideQuests.filter((sideQuest) => sideQuest.id);
        const deleteSideQuestIdList = targetSideQuests.filter(
          (sideQuest) =>
            !updateSideQuestList.some((sideQuestItem) => sideQuestItem.id === sideQuest.id)
        );

        for (const sideQuest of updateSideQuestList) {
          const targetSideQuest = targetSideQuests.find(
            (sideQuestItem) => sideQuestItem.id === sideQuest.id
          );
          if (!targetSideQuest) {
            throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
          }

          const updatedQuest = this.sideQuestRepository.merge(targetSideQuest, {
            ...sideQuest,
            updatedAt: currentDate,
          });
          await queryRunner.manager.save(updatedQuest);
        }

        for (const sideQuest of deleteSideQuestIdList) {
          await queryRunner.manager.delete(SideQuest, { id: sideQuest.id });
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
