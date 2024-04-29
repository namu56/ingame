import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_info')
export class UserInfo extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @Column()
  nickname: string;

  @Column()
  profilePhoto: string;

  @Column()
  intro: string;

  @Column()
  point: number;

  @OneToOne(() => User, (user) => user.userInfo)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
