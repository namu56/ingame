import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import { BigIntTransformer } from 'src/core/database/typeorm/transformer/big-int.transformer';
import { Status } from '@common/types/quest/quest.type';
import { Quest } from '../quest/quest.entity';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('side_quest')
export class SideQuest extends BaseTimeEntity {
  @PrimaryColumn({ type: 'bigint', transformer: new BigIntTransformer() })
  @Generated('increment')
  id: number;

  @Column({ type: 'bigint', nullable: false, transformer: new BigIntTransformer() })
  questId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  content: string;

  @Column({ type: 'enum', name: 'status', enum: Status, default: Status.ON_PROGRESS })
  status: Status;

  @ManyToOne(() => Quest, (quest) => quest.sideQuests, {
    onDelete: 'CASCADE',
  })
  quest: Quest;

  static create(questId: number, content: string): SideQuest {
    const sideQuest = new SideQuest();
    sideQuest.questId = questId;
    sideQuest.content = content;
    sideQuest.status = Status.ON_PROGRESS;

    return sideQuest;
  }

  updateContent(content: string): void {
    this.content = content;
  }

  updateStatus(status: Status): void {
    this.status = status;
  }
}
