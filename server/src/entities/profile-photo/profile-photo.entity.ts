import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('profile_photo')
export class ProfilePhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhotoUrl: string;

  @OneToOne(() => User, (user) => user.profilePhoto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  create(profilePhotoUrl: string): ProfilePhoto {
    const profilePhoto = new ProfilePhoto();
    profilePhoto.profilePhotoUrl = profilePhotoUrl;
    return profilePhoto;
  }
}
