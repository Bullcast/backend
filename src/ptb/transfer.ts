import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { buildPTBTransaction, formatCoinType } from "./utils";
import { client } from ".";

export const getTransferTransaction = async (from: string, to: string, amount: number | string, txb?: Transaction, type?: string): Promise<Buffer> => {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  if (type) type = formatCoinType(type);
  if (!txb) {
    txb = new Transaction();
  }
  try {
    const coinMetadata = await client.getCoinMetadata({
      coinType: type || "0x2::sui::SUI",
    });
    if (coinMetadata) {
      amount = amount * Math.pow(10, coinMetadata.decimals);
    }
  } catch(e) {
    console.error(e);
  }
  txb.transferObjects([
    coinWithBalance({ balance: amount, type })
  ], to);
  return await buildPTBTransaction(from, txb);;
}
