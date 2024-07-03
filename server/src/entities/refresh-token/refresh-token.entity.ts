import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BigIntTransformer } from 'src/core/database/typeorm/transformer/big-int.transformer';
import { BaseTimeEntity } from '@core/database/typeorm/base-time.entity';

@Entity('refresh_token')
export class RefreshToken extends BaseTimeEntity {
  @PrimaryColumn({ type: 'bigint', transformer: new BigIntTransformer() })
  @Generated('increment')
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 500, nullable: false, unique: true })
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
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
