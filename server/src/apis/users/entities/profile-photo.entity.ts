import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('profile_photo')
export class ProfilePhoto extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhoto: string;

  @OneToOne(() => User, (user) => user.profilePhoto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
