import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from '../../apis/quests/entities/quest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(@InjectRepository(Quest) private readonly questRepository: Repository<Quest>) {}
}
