import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { SideQuest } from '../side-quest/side-quest.entity';
import { Difficulty, isHidden, Mode, Status } from '../../common/types/quest/quest.type';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';

@Entity('quest')
export class Quest extends BaseTimeEntity {
  constructor(questData: Partial<Quest>) {
    super();
    Object.assign(this, questData);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'enum', enum: Difficulty, nullable: false })
  difficulty: Difficulty;

  @Column({ type: 'enum', enum: Mode, nullable: false })
  mode: Mode;

  @Column({ type: 'enum', enum: isHidden, nullable: false })
  hidden: isHidden;

  @Column({ type: 'enum', enum: Status, default: Status.ON_PROGRESS, nullable: false })
  status: Status;

  @Column({ type: 'varchar', nullable: false })
  startDate: string;

  @Column({ type: 'varchar', nullable: true })
  endDate: string | null;

  @ManyToOne(() => User, (user) => user.quests, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => SideQuest, (sideQuest) => sideQuest.quest)
  sideQuests: SideQuest[];
}
