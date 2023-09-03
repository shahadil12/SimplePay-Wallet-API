import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Wallet } from "./Wallet";

export enum TransactionEnum {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  amount: number;

  @Column()
  balance: number;

  @Column({ length: 100 })
  description: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date: string;

  @Column({
    type: "enum",
    enum: TransactionEnum,
  })
  type: TransactionEnum;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;
}
