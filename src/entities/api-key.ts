import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntityWithTimestamps } from "./base";
import { User } from "./user";

export enum ApiKeyStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  REVOKED = "revoked"
}

@Entity('api_keys')
export class ApiKey extends BaseEntityWithTimestamps {
  @Column({ unique: true })
  key: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({
    type: "enum",
    enum: ApiKeyStatus,
    default: ApiKeyStatus.ACTIVE
  })
  status: ApiKeyStatus;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'json', nullable: true })
  permissions: string[];

  @Column({ type: 'int', default: 0 })
  usageCount: number;
}