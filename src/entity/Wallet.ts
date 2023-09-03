import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  BaseEntity,
  OneToMany,
} from "typeorm";

import { Transaction } from "./Transaction";

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  balance: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date: string;

  @Column()
  @Generated("uuid")
  transactionId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
