import { Wallet } from "../entity/Wallet";
import { AppDataSource } from "../data-source";
import { Transaction } from "../entity/Transaction";
import { TransactionEnum } from "../entity/Transaction";
import { transaction } from "../middleware/validator/transaction";
import { wallet } from "../middleware/validator/wallet";
const NodeCache = require("node-cache");

export class WalletService {
  cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

  public async getAllTransactions(
    walletId: number,
    skip: number = 0,
    limit: number = 0
  ) {
    try {
      const transactions = await AppDataSource.createQueryBuilder()
        .relation(Wallet, "transactions")
        .of(walletId)
        .loadMany();

      const skipCount = skip < 0 ? 0 : skip;
      const limitCount =
        limit >= transactions.length ? transactions.length : limit + 1;

      const transactionRepo = AppDataSource.manager.getRepository(Transaction);

      // const transactions = await transactionRepo.find({
      //   skip,
      //   take: limit,
      //   where: { walletId: walletId },
      // });

      return {
        success: true,
        result: transactions.slice(skipCount, limitCount),
      };
    } catch (error) {
      return { status: 502, error };
    }
  }

  public async getWalletDetails(walletId: number) {
    try {
      if (this.cache.has(walletId)) {
        console.log("from cache");
        return this.cache.get(walletId);
      }

      const walletDetails = await AppDataSource.manager
        .getRepository(Wallet)
        .findOne({ where: { id: walletId } });
      console.log("from db");
      this.cache.set(walletId, walletDetails);

      return { success: true, details: walletDetails };
    } catch (error) {
      return { status: 502, error };
    }
  }

  public async setWallet(setUp: wallet) {
    try {
      const wallet = new Wallet();
      wallet.name = setUp.name;
      wallet.balance = setUp.balance;
      const response = await wallet.save();
      return { success: true, response };
    } catch (error) {
      return { staus: 502, error };
    }
  }

  public async setTransaction(
    transactionDetails: transaction,
    walletId: number
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOneBy(Wallet, {
        id: walletId,
      });
      const amount = +transactionDetails.amount;

      const transactionType: TransactionEnum =
        amount >= 0 ? TransactionEnum.CREDIT : TransactionEnum.DEBIT;

      if (
        transactionType === TransactionEnum.DEBIT &&
        wallet.balance < amount
      ) {
        return { status: 201, error: "Insufficant Balance" };
      }

      const newBalance = Math.round(wallet.balance) + amount;

      await queryRunner.manager.update(
        Wallet,
        {
          id: walletId,
        },
        { balance: newBalance }
      );

      const updatedWallet = await queryRunner.manager.findOneBy(Wallet, {
        id: walletId,
      });

      const transection = await queryRunner.manager.save(Transaction, {
        amount: +transactionDetails.amount,
        description: transactionDetails.description,
        type: transactionType,
        balance: updatedWallet.balance,
        wallet: wallet,
      });
      await queryRunner.commitTransaction();
      return {
        success: true,
        result: {
          balance: updatedWallet.balance,
          transactionId: updatedWallet.transactionId,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { status: 503, error: error };
    } finally {
      await queryRunner.release();
    }
  }
}
