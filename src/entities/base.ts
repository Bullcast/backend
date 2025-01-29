import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntityWithTimestamps extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: "deleted_at",
  })
  deletedAt: Date;
}