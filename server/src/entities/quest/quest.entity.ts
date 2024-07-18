import { Column, Entity, Generated, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { SideQuest } from '../side-quest/side-quest.entity';
import { Difficulty, Hidden, Mode, Status } from '../../common/types/quest/quest.type';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';
import { BigIntTransformer } from 'src/core/database/typeorm/transformer/big-int.transformer';

@Entity('quest')
export class Quest extends BaseTimeEntity {
  @PrimaryColumn({ type: 'bigint', transformer: new BigIntTransformer() })
  @Generated('increment')
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.DEFAULT, nullable: false })
  difficulty: Difficulty;

  @Column({ type: 'enum', enum: Mode, nullable: false })
  mode: Mode;

  @Column({ type: 'enum', enum: Hidden, default: Hidden.FALSE, nullable: false })
  hidden: Hidden;

  @Column({ type: 'enum', enum: Status, default: Status.ON_PROGRESS, nullable: false })
  status: Status;

  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: false })
  endDate: Date;

  @ManyToOne(() => User, (user) => user.quests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => SideQuest, (sideQuest) => sideQuest.quest, {
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  sideQuests: SideQuest[];

  constructor() {
    super();
  }

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
    endDate: Date,
    sideQuests: SideQuest[]
  ): void {
    this.title = title;
    this.difficulty = difficulty;
    this.hidden = hidden;
    this.startDate = startDate;
    this.endDate = endDate;
    this.sideQuests = sideQuests;
  }

  updateSubQuest(title: string, hidden: Hidden): void {
    this.title = title;
    this.hidden = hidden;
  }
}
