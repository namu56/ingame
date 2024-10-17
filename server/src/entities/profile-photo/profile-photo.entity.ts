import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('profile_photo')
export class ProfilePhoto extends BaseTimeEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePhotoUrl: string;

  @OneToOne(() => User, (user) => user.profilePhoto, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  static create(): ProfilePhoto {
    const profilePhoto = new ProfilePhoto();
    return profilePhoto;
  }

  update(profilePhotoUrl: string): void {
    this.profilePhotoUrl = profilePhotoUrl;
  }
}
