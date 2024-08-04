import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { SideQuest } from '../side-quest/side-quest.entity';
import { Difficulty, Hidden, Mode, Status } from '../../common/types/quest/quest.type';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';

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

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
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
    startDate: Date,
    endDate: Date,
    hidden: Hidden
  ): Quest {
    const quest = new Quest();
    quest.userId = userId;
    quest.title = title;
    quest.difficulty = difficulty;
    quest.mode = Mode.MAIN;
    quest.startDate = startDate;
    quest.endDate = endDate;
    quest.hidden = hidden;
    quest.status = Status.ON_PROGRESS;

    return quest;
  }

  static createSubQuest(
    userId: number,
    title: string,
    startDate: Date,
    endDate: Date,
    hidden: Hidden
  ): Quest {
    const quest = new Quest();
    quest.userId = userId;
    quest.title = title;
    quest.difficulty = Difficulty.DEFAULT;
    quest.mode = Mode.SUB;
    quest.startDate = startDate;
    quest.endDate = endDate;
    quest.hidden = hidden;
    quest.status = Status.ON_PROGRESS;

    return quest;
  }

  updateMainQuest(
    title: string,
    difficulty: Difficulty,
    hidden: Hidden,
    startDate: Date,
    endDate: Date
  ): void {
    this.title = title;
    this.difficulty = difficulty;
    this.hidden = hidden;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  updateStatus(status: Status): void {
    this.status = status;
  }

  updateSideQuests(sideQuests: SideQuest[]): void {
    this.sideQuests = sideQuests;
  }

  updateSubQuest(title: string, hidden: Hidden): void {
    this.title = title;
    this.hidden = hidden;
  }
}
