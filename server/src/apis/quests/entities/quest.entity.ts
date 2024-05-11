import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { sideQuest } from './side-quest.entity';
import { Difficulty, isHidden, Mode, Status } from '../enums/quest.enum';

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

  @Column('timestamp', { nullable: false })
  startDate: Date;

  @Column('timestamp', { nullable: true })
  endDate: Date;

  @Column({ type: 'enum', name: 'hidden', enum: isHidden })
  hidden!: isHidden;

  @Column({ type: 'enum', name: 'status', enum: Status, default: Status.onProgress })
  status!: Status;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.quests, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @OneToMany(() => sideQuest, (sideQuest) => sideQuest.quest)
  sideQuests: sideQuest[];
}
