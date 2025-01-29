import path from "path";

import { DataSource } from "typeorm";

import { env, isLocal } from "../config/config";

export const dataSource = new DataSource({
  entities: [path.join(__dirname, "../entities/*{.js,.ts}")],
  migrations: [path.join(__dirname, "./migrations/*{.js,.ts}")],
  port: 3306,
  synchronize: isLocal() ? true : false,
  timezone: "+00:00",
  url: env.mysql.url,
  type: "mysql",
});
