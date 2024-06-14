import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { SideQuest } from '../side-quest/side-quest.entity';
import { Difficulty, isHidden, Mode, Status } from '../../common/types/quest/quest.type';

@Entity('quest')
export class Quest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'enum', name: 'difficulty', enum: Difficulty })
  difficulty!: Difficulty;

  @Column({ type: 'enum', name: 'mode', enum: Mode })
  mode!: Mode;

  @Column('date', { nullable: false })
  startDate: string;

  @Column('date', { nullable: true })
  endDate: string;

  @Column({ type: 'enum', name: 'hidden', enum: isHidden })
  hidden!: isHidden;

  @Column({ type: 'enum', name: 'status', enum: Status, default: Status.onProgress })
  status!: Status;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.quests, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => SideQuest, (sideQuest) => sideQuest.quest)
  sideQuests: SideQuest[];
}
