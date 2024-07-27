import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('profile_photo')
export class ProfilePhoto extends BaseTimeEntity {
  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhotoUrl: string;

  @OneToOne(() => User, (user) => user.profilePhoto, { onDelete: 'CASCADE' })
  user: User;

  static create(userId: number): ProfilePhoto {
    const profilePhoto = new ProfilePhoto();
    profilePhoto.userId = userId;
    return profilePhoto;
  }

  update(profilePhotoUrl: string): void {
    this.profilePhotoUrl = profilePhotoUrl;
  }
}
