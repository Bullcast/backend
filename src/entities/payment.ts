import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntityWithTimestamps } from "./base";
import { User } from "./user";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed"
}

export enum ChainType {
  SUI = "sui",
  ETH = "eth"
}

@Entity('payments')
export class Payment extends BaseEntityWithTimestamps {
  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: "enum",
    enum: ChainType
  })
  chainType: ChainType;

  @Column()
  amount: string;

  @Column()
  txHash: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}