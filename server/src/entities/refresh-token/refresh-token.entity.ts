import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('refresh_token')
export class RefreshToken extends BaseTimeEntity {
  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 500, unique: true })
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  static create(userId: number, token: string): RefreshToken {
    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.token = token;
    return refreshToken;
  }

  update(newToken: string): void {
    this.token = newToken;
  }
}
