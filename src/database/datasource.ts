import path from 'path';

import { DataSource } from 'typeorm';

import { env, isLocal } from '../config/config';

export const dataSource = new DataSource({
  database: env.mysql.db,
  entities: [path.join(__dirname, '../entities/*{.js,.ts}')],
  host: env.mysql.host,
  migrations: [path.join(__dirname, './migrations/*{.js,.ts}')],
  password: env.mysql.password,
  port: 3306,
  synchronize: isLocal() ? true : false,
  timezone: '+00:00',
  type: 'mysql',
  username: env.mysql.user,
});