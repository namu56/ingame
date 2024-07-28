import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Status } from '@common/types/quest/quest.type';
import { Quest } from '../quest/quest.entity';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('side_quest')
export class SideQuest extends BaseTimeEntity {
  @Column({ type: 'bigint' })
  questId: number;

  @Column({ type: 'varchar', length: 50 })
  content: string;

  @Column({ type: 'enum', enum: Status, default: Status.ON_PROGRESS })
  status: Status;

  @ManyToOne(() => Quest, (quest) => quest.sideQuests)
  @JoinColumn({ name: 'quest_id', referencedColumnName: 'id' })
  quest: Quest;

  static create(questId: number, content: string): SideQuest {
    const sideQuest = new SideQuest();
    sideQuest.questId = questId;
    sideQuest.content = content;
    sideQuest.status = Status.ON_PROGRESS;

    return sideQuest;
  }

  async updateContent(content: string): Promise<void> {
    this.content = content;
  }

  updateStatus(status: Status): void {
    this.status = status;
  }
}
