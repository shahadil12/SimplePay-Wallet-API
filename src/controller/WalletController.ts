import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Res,
  QueryParam,
} from "routing-controllers";
import { Response } from "express";
import { WalletService } from "../service/WalletService";
import { transaction } from "../middleware/validator/transaction";
import { wallet } from "../middleware/validator/wallet";

@JsonController()
export class WalletController {
  walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  @Get("/transactions")
  async getAllTransactions(
    @Res() response: Response,
    @QueryParam("walletId") walletId: number,
    @QueryParam("limit") limit: number,
    @QueryParam("skip") skip: number
  ) {
    const result = await this.walletService.getAllTransactions(
      walletId,
      skip,
      limit
    );
    return response.send(result);
  }

  @Get("/wallet/:id")
  async getWalletDetails(
    @Param("id") walletId: number,
    @Res() response: Response
  ) {
    const result = await this.walletService.getWalletDetails(walletId);
    return response.send(result);
  }

  @Post("/setup")
  async setWallet(
    @Res() response: Response,
    @Body({ validate: true }) wallet: wallet
  ) {
    const result = await this.walletService.setWallet(wallet);
    return response.send(result);
  }

  @Post("/transact/:walletId")
  async setTransaction(
    @Param("walletId") walletId: number,
    @Body({ validate: true }) transaction: transaction,
    @Res()
    response: Response
  ) {
    const result = await this.walletService.setTransaction(
      transaction,
      walletId
    );
    return response.send(result);
  }
}
