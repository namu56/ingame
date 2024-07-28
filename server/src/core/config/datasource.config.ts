import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
});

const isProduction = process.env.NODE_ENV === 'production';

const entityPath = path.join(__dirname, '../../entities/**/*.entity.{js,ts}');
const migrationPath = path.join(__dirname, '../../migrations/*.{js,ts}');

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [entityPath],
  synchronize: true,
  migrationsRun: false,
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: 'migrations',
  migrations: [migrationPath],
  logging: isProduction ? ['error'] : true,
  timezone: 'Z',
  bigNumberStrings: false,
};

export const MysqlDataSource = new DataSource(dataSourceOptions);
