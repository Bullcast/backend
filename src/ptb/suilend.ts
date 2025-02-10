import { initializeSuilend, LENDING_MARKET_ID, SuilendClient } from "@suilend/sdk";
import { client } from "./index";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { buildPTBTransaction } from "../utils/utils";
import { formatCoinType } from "../utils/format";

export const getSuilendDepositTransaction = async (from: string, amount: number | string, type: string, txb?: Transaction): Promise<Buffer> => {
  const suilendClient = await SuilendClient.initialize(LENDING_MARKET_ID, "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL", client);
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  if (!txb) {
    txb = new Transaction();
  }
  const coinMetadata = await client.getCoinMetadata({
    coinType: type,
  });
  if (coinMetadata) {
    amount = amount * Math.pow(10, coinMetadata.decimals);
  }

  let obligationOwnerCaps = await SuilendClient.getObligationOwnerCaps(from, [
    "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL"
  ], client);

  const coin = coinWithBalance({ balance: amount, type })

  if (obligationOwnerCaps.length === 0) {
    const obligationOwnerCapId = suilendClient.createObligation(
      txb,      
    );
    suilendClient.deposit(coin, type, obligationOwnerCapId, txb);
    txb.transferObjects([obligationOwnerCapId], from);
  } else {
    suilendClient.deposit(coin, type, obligationOwnerCaps[0].id, txb);
  }

  return await buildPTBTransaction(from, txb);
}

export const getSuilendWithdrawTransaction = async (from: string, amount: number | string, type: string, txb?: Transaction): Promise<Buffer> => {
  const suilendClient = await SuilendClient.initialize(LENDING_MARKET_ID, "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL", client);
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  type = formatCoinType(type);
  if (!txb) {
    txb = new Transaction();
  }
  const coinMetadata = await client.getCoinMetadata({
    coinType: type,
  });
  if (coinMetadata) {
    amount = amount * Math.pow(10, coinMetadata.decimals);
  }

  let obligationOwnerCaps = await SuilendClient.getObligationOwnerCaps(from, [
    "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL"
  ], client);

  if (obligationOwnerCaps.length === 0) {
    throw new Error("No obligation found for user");
  }

  const obligation = await suilendClient.getObligation(obligationOwnerCaps[0].obligationId);
  const tokenInDepositPosition = obligation?.deposits?.find(
    (d) => formatCoinType(d.coinType.toJSON().name) === type,
  );

  if (!tokenInDepositPosition?.depositedCtokenAmount) {
    throw new Error("No deposited amount found for user");
  }

  const amountWithdraw = amount < tokenInDepositPosition?.depositedCtokenAmount ? amount : tokenInDepositPosition?.depositedCtokenAmount;

  const objects = await suilendClient.withdraw(obligationOwnerCaps[0].id, obligationOwnerCaps[0].obligationId, type, amountWithdraw.toString(), txb);
  return await buildPTBTransaction(from, txb);
}

export const getSuilendStatus = async (from: string): Promise<any> => {
  const suilendClient = await SuilendClient.initialize(LENDING_MARKET_ID, "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL", client);
  const initSuilend = await initializeSuilend(client, suilendClient, from);
  let text = "";
  if (initSuilend.obligations) {
    for (const obligation of initSuilend.obligations) {
      text += `You can borrow up to ${obligation.minPriceBorrowLimit.toString(10)} USD\n`;
      for (const deposit of obligation.deposits) {
        const type = formatCoinType(deposit.coinType);
        text += `You supplied ${deposit.depositedAmount.toString(10)} amount of ${type} with value of ${deposit.depositedAmountUsd} USD - \n`;    
      }   
      for (const borrow of obligation.borrows) {
        const type = formatCoinType(borrow.coinType);
        text += `You borrowed ${borrow.borrowedAmount.toString(10)} amount of ${type} with value of ${borrow.borrowedAmountUsd} USD - \n`;    
      }
    }

  }
  if (text) {
    return {
      text
    };
  }
  return null;
}