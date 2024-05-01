import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_info')
@Unique(['nickname'])
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  intro: string;

  @Column({ type: 'int', default: 0 })
  point: number;

  @OneToOne(() => User, (user) => user.userInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
