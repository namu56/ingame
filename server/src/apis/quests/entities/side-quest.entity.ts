import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quest } from './quest.entity';
import { Status } from '../enums/quest.enum';

@Entity('side_quest')
export class sideQuest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: false })
  questId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  content: string;

  @Column({ type: 'enum', name: 'status', enum: Status, default: Status.onProgress })
  status: Status;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Quest, (quest) => quest.sideQuests, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: true,
  })
  quest: Quest;
}
