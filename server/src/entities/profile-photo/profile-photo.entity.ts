import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('profile_photo')
export class ProfilePhoto extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhotoUrl: string;

  @OneToOne(() => User, (user) => user.profilePhoto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
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
