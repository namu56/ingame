import { Column, Entity, Generated, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { SideQuest } from '../side-quest/side-quest.entity';
import { Difficulty, Hidden, Mode, Status } from '../../common/types/quest/quest.type';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';
import { BigIntTransformer } from 'src/core/database/typeorm/transformer/big-int.transformer';
import { toUTCEndOfDay, toUTCStartOfDay } from '@common/utils/date.util';

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

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @ManyToOne(() => User, (user) => user.quests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => SideQuest, (sideQuest) => sideQuest.quest)
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
    quest.startDate = toUTCStartOfDay(startDate);
    quest.endDate = endDate ? toUTCEndOfDay(endDate) : null;
    quest.hidden = hidden;
    quest.status = Status.ON_PROGRESS;

    return quest;
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
    quest.mode = Mode.MAIN;
    quest.startDate = toUTCStartOfDay(startDate);
    quest.endDate = toUTCEndOfDay(endDate);
    quest.hidden = hidden;
    quest.status = Status.ON_PROGRESS;

    return quest;
  }
}
