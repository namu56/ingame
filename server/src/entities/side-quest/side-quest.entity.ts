import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quest } from '../quest/quest.entity';
import { Status } from '../../common/types/quest/quest.type';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';

@Entity('side_quest')
export class SideQuest extends BaseTimeEntity {
  constructor(sideQuestData: Partial<SideQuest>) {
    super();
    Object.assign(this, sideQuestData);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  questId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  content: string;

  @Column({ type: 'enum', name: 'status', enum: Status, default: Status.onProgress })
  status: Status;

  @ManyToOne(() => Quest, (quest) => quest.sideQuests, {
    onDelete: 'CASCADE',
  })
  quest: Quest;
}
