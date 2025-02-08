import { Body, Controller, Get, Query, Route, Tags } from "tsoa";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { coinWithBalance, Transaction } from '@mysten/sui/transactions';
import { Buffer } from 'buffer';
import { env } from "../config/config";
import { Aftermath } from "aftermath-ts-sdk";
import { LENDING_MARKET_ID, SuilendClient, initializeSuilend, parseObligation } from "@suilend/sdk";

export const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
const USDC = "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";
const afSdk = new Aftermath("MAINNET"); // "MAINNET" | "TESTNET"

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
  txb.setSenderIfNotSet(from);
  txb.setGasBudget(100000000);
  const builtTx = await txb.build({
    client,
  });
  const buffer = Buffer.from(builtTx);
  return buffer;
}

function formatCoinType(coinType: string): string {
  const parts = coinType.split("::");
  if (parts.length !== 3) {
    throw new Error(`Invalid coinType format: ${coinType}`);
  }

  let [pkg, module, struct] = parts;
  // check if pkg is 0x64 and fix it
  if (pkg.startsWith("0x")) {
    const addressParts = pkg.substring(2);
    if (addressParts.length <= 64) {
      const padding = "0".repeat(64 - addressParts.length);
      pkg = `0x${padding}${addressParts}`;
    } else if (addressParts.length > 64) {
      throw new Error(`Invalid address length: ${pkg}`);
    }
  } else {
    if (pkg.length <= 64) {
      const padding = "0".repeat(64 - pkg.length);
      pkg = `0x${padding}${pkg}`;
    } else if (pkg.length > 64) {
      throw new Error(`Invalid address length: ${pkg}`);
    }
  }
  return `${pkg.toLowerCase()}::${module.toLowerCase()}::${struct.toUpperCase()}`;
}

function formatBigInt(value: bigint | string, decimals: number): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  if (typeof value === "string") {
    value = BigInt(value);
  }
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  const fractionalPartStr = fractionalPart.toString().padStart(decimals, '0');
  return `${integerPart.toString()}.${fractionalPartStr}`;
}

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
  txb.setSenderIfNotSet(from);
  txb.setGasBudget(100000000);
  const builtTx = await txb.build({
    client
  });
  const buffer = Buffer.from(builtTx);
  return buffer;
}

export const getLendingDepositTransaction = async (from: string, amount: number | string, type: string, txb?: Transaction): Promise<Buffer> => {
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

  txb.setSenderIfNotSet(from);
  txb.setGasBudget(100000000);
  return Buffer.from(await txb.build({ client }));
}

export const getLendingWithdrawTransaction = async (from: string, amount: number | string, type: string, txb?: Transaction): Promise<Buffer> => {
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
  txb.transferObjects([objects], from);
  txb.setSenderIfNotSet(from);
  txb.setGasBudget(100000000);
  return Buffer.from(await txb.build({ client }));
}

export const getLendingStatus = async (from: string): Promise<any> => {
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