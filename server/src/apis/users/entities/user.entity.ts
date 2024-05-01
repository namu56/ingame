import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserInfo } from './user-info.entity';
import { Quest } from '../../quests/entities/quest.entity';
import { ProfilePhoto } from './profile-photo.entity';

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  userInfo: UserInfo;

  @OneToOne(() => ProfilePhoto, (ProfilePhoto) => ProfilePhoto.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  profilePhoto: ProfilePhoto;

  @OneToMany(() => Quest, (quest) => quest.user, { onDelete: 'CASCADE' })
  quests: Quest[];
}
