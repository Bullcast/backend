import { Controller, Get, Query, Route, Tags } from "tsoa";
import { client } from '../ptb/index';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { Buffer } from 'buffer';
import { env } from "../config/config";
import { getTransferTransaction } from "../ptb/transfer";
import { getSwapTransaction } from "../ptb/swap";

const USDC = "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";

@Route("api/build-transaction")
export class BuildTransactionController extends Controller {
  @Get("transfer")
  @Tags("Transaction")
  public async getTransferTransaction(
    @Query() from: string,
    @Query() to: string,
    @Query() amount: number,
    @Query() type?: string,
  ): Promise<Buffer> {
    try {
      return getTransferTransaction(from, to, amount, undefined, type);  
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("invest")
  @Tags("Transaction")
  public async getInvestTransaction(
    @Query() from: string,
    @Query() amount: number,
  ): Promise<Buffer> {
    try {
      const tx = new Transaction();
      tx.moveCall({
        package: env.sui.package,
        module: "auto_invest",
        function: "create_investment",
        arguments: [coinWithBalance({ balance: amount, type: USDC })],
      });

      tx.setSenderIfNotSet(from);
      const builtTx = await tx.build({
        client,
      });
      const buffer = Buffer.from(builtTx);
      return buffer;  
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("swap")
  @Tags("Transaction")
  public async getSwapTransaction(
    @Query() from: string,
    @Query() coinInType: string,
    @Query() coinOutType: string,
    @Query() amountIn: number,
    @Query() slippage?: number,
  ): Promise<Buffer> {
    try {
      return getSwapTransaction(from, coinInType, coinOutType, amountIn, undefined, slippage);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}