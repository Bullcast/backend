import { Transaction } from "@mysten/sui/transactions";
import { buildPTBTransaction } from "../utils/utils";
import { client } from "./index";
import { Aftermath } from "aftermath-ts-sdk";
import { formatCoinType } from "../utils/format";

const afSdk = new Aftermath("MAINNET"); // "MAINNET" | "TESTNET"

export const getSwapTransaction = async (from: string, coinInType: string, coinOutType: string, amountIn: number | string, txb?: Transaction, slippage?: number): Promise<Buffer> => {
  // package::module::struct 
  // package and module is lower case, struct is upper case
  if (typeof amountIn === "string") {
    amountIn = parseFloat(amountIn);
  }
  coinInType = formatCoinType(coinInType);
  coinOutType = formatCoinType(coinOutType);
  if (!txb) {
    txb = new Transaction();
  }
  const coinMetadata = await client.getCoinMetadata({
    coinType: coinInType,
  });
  if (coinMetadata) {
    amountIn = amountIn * Math.pow(10, coinMetadata.decimals);
  }
  await afSdk.init();
  const router = afSdk.Router();
  const route = await router.getCompleteTradeRouteGivenAmountIn({
    coinInType,
    coinOutType,
    coinInAmount: BigInt(amountIn),
  });      
  const res = await router.addTransactionForCompleteTradeRoute({
    tx: txb,
    walletAddress: from,
    completeRoute: route,
    slippage: slippage ?? 0.1,
  });
  txb = res.tx;
  txb.transferObjects([res.coinOutId!], from);
  return await buildPTBTransaction(from, txb);;
}
