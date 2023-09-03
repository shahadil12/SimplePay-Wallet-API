import "reflect-metadata";
import { DataSource } from "typeorm";
import { Wallet } from "./entity/Wallet";
import { Transaction } from "./entity/Transaction";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.USERNAME,
  password: "1a234567@A",
  database: "walletSystem",
  synchronize: true,
  logging: false,
  entities: [Wallet, Transaction],
  migrations: [],
  subscribers: [],
});
