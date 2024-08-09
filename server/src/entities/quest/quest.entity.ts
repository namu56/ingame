import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { SideQuest } from '../side-quest/side-quest.entity';
import { Difficulty, Hidden, Mode, Status } from '../../common/types/quest/quest.type';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';
import { StartDateTransformer } from '@core/database/typeorm/transformer/start-date.transformer';
import { EndDateTransformer } from '@core/database/typeorm/transformer/end-date.transformer';

@Entity('quest')
export class Quest extends BaseTimeEntity {
  @Column({ type: 'bigint' })
  userId: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.DEFAULT })
  difficulty: Difficulty;

  @Column({ type: 'enum', enum: Mode })
  mode: Mode;

  @Column({ type: 'enum', enum: Hidden, default: Hidden.FALSE })
  hidden: Hidden;

  @Column({ type: 'enum', enum: Status, default: Status.ON_PROGRESS })
  status: Status;

  @Column({ type: 'timestamp', precision: 3, transformer: new StartDateTransformer() })
  startDate: Date;

  @Column({ type: 'timestamp', precision: 3, transformer: new EndDateTransformer() })
  endDate: Date;

  @ManyToOne(() => User, (user) => user.quests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => SideQuest, (sideQuest) => sideQuest.quest, {
    cascade: ['insert'],
  })
  sideQuests: SideQuest[];

  static createMainQuest(
    userId: number,
    title: string,
    difficulty: Difficulty,
    startDate: string,
    endDate: string,
    hidden: Hidden
  ): Quest {
    const quest = new Quest();
    quest.userId = userId;
    quest.title = title;
    quest.difficulty = difficulty;
    quest.mode = Mode.MAIN;
    quest.startDate = quest.setStartDate(startDate);
    quest.endDate = quest.setEndDate(endDate);
    quest.hidden = hidden;
    quest.status = Status.ON_PROGRESS;

    return quest;
  }

  createSideQuests(sideQuests: SideQuest[]): void {
    this.sideQuests = sideQuests;
  }

  static createSubQuest(
    userId: number,
    title: string,
    startDate: string,
    endDate: string,
    hidden: Hidden
  ): Quest {
    const quest = new Quest();
    quest.userId = userId;
    quest.title = title;
    quest.difficulty = Difficulty.DEFAULT;
    quest.mode = Mode.SUB;
    quest.startDate = quest.setStartDate(startDate);
    quest.endDate = quest.setEndDate(endDate);
    quest.hidden = hidden;
    quest.status = Status.ON_PROGRESS;

    return quest;
  }

  updateMainQuest(
    title: string,
    difficulty: Difficulty,
    hidden: Hidden,
    startDate: string,
    endDate: string
  ): void {
    this.title = title;
    this.difficulty = difficulty;
    this.hidden = hidden;
    this.startDate = this.setStartDate(startDate);
    this.endDate = this.setEndDate(endDate);
  }

  updateStatus(status: Status): void {
    this.status = status;
  }

  updateSubQuest(title: string, hidden: Hidden): void {
    this.title = title;
    this.hidden = hidden;
  }

  private setStartDate(value: string): Date {
    return new StartDateTransformer().to(value);
  }

  private setEndDate(value: string): Date {
    return new EndDateTransformer().to(value);
  }
}
