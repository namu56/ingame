import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { UsersModule } from './apis/users/users.module';
import { RankingModule } from './apis/ranking/ranking.module';
import { QuestsModule } from './apis/quests/quests.module';
import { AuthModule } from './apis/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => await typeORMConfig(configService),
    }),
    UsersModule,
    AuthModule,
    QuestsModule,
    RankingModule,
  ],
})
export class AppModule {}
