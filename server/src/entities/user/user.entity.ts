import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserInfo } from '../user-info/user-info.entity';
import { Quest } from '../quest/quest.entity';
import { ProfilePhoto } from '../profile-photo/profile-photo.entity';
import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';

@Entity('user')
@Unique(['email'])
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  provider: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  providerId: string | null;

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

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    eager: false,
    onDelete: 'CASCADE',
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Quest, (quest) => quest.user, { onDelete: 'CASCADE' })
  quests: Quest[];

  static createLocal(email: string, password: string): User {
    const user = new User();
    user.email = email;
    user.password = password;
    return user;
  }

  static createSocial(email: string, provider: string, providerId: string): User {
    const user = new User();
    user.email = email;
    user.provider = provider;
    user.providerId = providerId;
    return user;
  }
}
