import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { sideQuest } from './side-quest.entity';

@Entity('quest')
export class Quest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  difficulty: string;

  @Column()
  mode: string;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column()
  hidden: string;

  @Column()
  status: string;

  @Column('timestamp')
  createdAt: Date;

  @Column('timestamp')
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.quests)
  user: User;

  @OneToMany(() => sideQuest, (sideQuest) => sideQuest.quest)
  sideQuests: sideQuest[];
}
