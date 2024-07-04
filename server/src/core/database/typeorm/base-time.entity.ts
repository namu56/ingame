import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RootEntity } from '../generic/root.entity';

export abstract class BaseTimeEntity extends RootEntity {
  @CreateDateColumn({ nullable: false, type: 'timestamp', comment: '생성 일자' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp', comment: '업데이트 일자' })
  updatedAt: Date;
}
