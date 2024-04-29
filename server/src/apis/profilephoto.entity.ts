import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('profile_photo')
export class ProfilePhoto extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @Column()
  profilePhoto: string;

  @OneToOne(() => User, (user) => user.profilePhoto)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
