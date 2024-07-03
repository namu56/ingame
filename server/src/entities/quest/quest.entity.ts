import { Column, Entity, Generated, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { SideQuest } from '../side-quest/side-quest.entity';
import { Difficulty, Hidden, Mode, Status } from '../../common/types/quest/quest.type';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';
import { BigIntTransformer } from 'src/core/database/typeorm/transformer/big-int.transformer';

@Entity('quest')
export class Quest extends BaseTimeEntity {
  constructor(questData: Partial<Quest>) {
    super();
    Object.assign(this, questData);
  }

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

  @Column({ type: 'varchar', nullable: false })
  start: string;

  @Column({ type: 'varchar', nullable: true })
  end: string | null;

  @ManyToOne(() => User, (user) => user.quests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => SideQuest, (sideQuest) => sideQuest.quest)
  sideQuests: SideQuest[];
}
