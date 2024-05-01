import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('user_info')
@Unique(['nickname'])
export class UserInfo extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  intro: string;

  @Column({ type: 'int', nullable: true })
  point: number;

  @OneToOne(() => User, (user) => user.userInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
