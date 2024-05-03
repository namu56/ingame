import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profile_photo')
export class ProfilePhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhoto: string;

  @OneToOne(() => User, (user) => user.profilePhoto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
