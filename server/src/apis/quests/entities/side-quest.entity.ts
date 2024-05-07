import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quest } from './quest.entity';

@Entity('side_quest')
export class sideQuest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questId: number;

  @Column()
  content: string;

  @Column()
  status: string;

  @Column('timestamp')
  createdAt: Date;

  @Column('timestamp')
  updatedAt: Date;

  @ManyToOne(() => Quest, (quest) => quest.sideQuests)
  quest: Quest;
}
