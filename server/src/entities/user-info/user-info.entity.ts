import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';

@Entity('user_info')
@Unique(['nickname'])
export class UserInfo extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  intro: string | null;

  @Column({ type: 'int', default: 0 })
  point: number;

  @OneToOne(() => User, (user) => user.userInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  static create(userId: number, nickname: string): UserInfo {
    const userInfo = new UserInfo();
    userInfo.userId = userId;
    userInfo.nickname = nickname;
    return userInfo;
  }

  update(nickname: string, intro: string | null): void {
    this.nickname = nickname;
    this.intro = intro;
  }
}
