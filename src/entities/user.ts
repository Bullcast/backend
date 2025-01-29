import { Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntityWithTimestamps } from "./base";

@Entity('user')
export class User extends BaseEntityWithTimestamps {
  @PrimaryColumn()
  wallet: number;
}