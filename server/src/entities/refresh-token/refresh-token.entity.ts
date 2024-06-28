import { BaseTimeEntity } from 'src/core/database/typeorm/base-time.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('refresh_token')
export class RefreshToken extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 500 })
  token: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  static create(userId: number, token: string): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.token = token;
    return refreshToken;
  }

  update(newToken: string): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.token = newToken;
    return refreshToken;
  }
}
