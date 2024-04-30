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
  difficulty: number;

  @Column()
  mode: number;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column()
  hidden: number;

  @ManyToOne(() => User, (user) => user.quests)
  user: User;

  @OneToMany(() => sideQuest, (sideQuest) => sideQuest.quest)
  sideQuests: sideQuest[];
}
