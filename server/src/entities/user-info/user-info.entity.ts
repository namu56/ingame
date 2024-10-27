import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('user_info')
export class UserInfo extends BaseTimeEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  nickname: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  intro: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhoto: string | null;

  @Column({ type: 'int', default: 0 })
  point: number;

  @OneToOne(() => User, (user) => user.userInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  static create(nickname: string): UserInfo {
    const userInfo = new UserInfo();
    userInfo.nickname = nickname;
    return userInfo;
  }

  update(nickname: string, intro: string | null): void {
    this.nickname = nickname;
    this.intro = intro;
  }

  updatePoint(point: number): void {
    this.point = point;
  }

  updateProfilePhoto(profilePhoto: string): void {
    this.profilePhoto = profilePhoto;
  }
}
