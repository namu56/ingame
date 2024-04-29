import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { UserInfo } from './userinfo.entity';
import { Quest } from './quest.entity';
import { ProfilePhoto } from './profilephoto.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user)
  userInfo: UserInfo;

  @OneToOne(() => ProfilePhoto, (ProfilePhoto) => ProfilePhoto.user)
  profilePhoto: ProfilePhoto;

  @OneToMany(() => Quest, (quest) => quest.user)
  quests: Quest[];
}
