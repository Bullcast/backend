import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { NAVISDKClient, depositCoin, pool, withdrawCoin } from "navi-sdk";
import { client } from ".";
import { buildPTBTransaction } from "../utils/utils";
import { Pool, PoolConfig } from "navi-sdk/dist/types";
import { formatCoinType } from "../utils/format";

export const getNaviDepositTransaction = async (from: string, amount: number | string, type: string, txb?: Transaction): Promise<Buffer> => {
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
        let symbol = coinMetadata.symbol;
        if (symbol === "SUI") symbol = "Sui";
        const depPoolConfig: PoolConfig = pool[symbol as keyof Pool];
        txb = await depositCoin(txb, depPoolConfig, coinWithBalance({ balance: amount, type }), amount);
        return await buildPTBTransaction(from, txb, 1000000000);
    } else {
        throw new Error(`Invalid coinType: ${type}`);
    }

}

export const getNaviWithdrawTransaction = async (from: string, amount: number | string, type: string, txb?: Transaction): Promise<Buffer> => {
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
        let symbol = coinMetadata.symbol;
        if (symbol === "SUI") symbol = "Sui";
        const withdrawPoolConfig: PoolConfig = pool[symbol as keyof Pool];
        const [wcoin, receipt] = await withdrawCoin(txb, withdrawPoolConfig, amount);
        txb.transferObjects([wcoin], from);
        return await buildPTBTransaction(from, txb, 1000000000);
    } else {
        throw new Error(`Invalid coinType: ${type}`);
    }
}

export const getNaviStatus = async (from: string): Promise<any> => {
    const naviClient = new NAVISDKClient({networkType: "mainnet" });
    const healthFactor = await naviClient.getHealthFactor(from);
    let rewards = await naviClient.getAddressAvailableRewards(from);
    const history = await naviClient.getClaimedRewardsHistory(from);
    if (rewards && typeof rewards === "object") {
        rewards = Object.values(rewards);  // Convert object to an array
    } else {
        rewards = [];  // Default to empty array if undefined/null
    }
    let text = `Health Factor: ${healthFactor}\nRewards:`;
    for (const reward of rewards) {
        text += `\n${reward.asset_id}, ${reward.funds}, ${reward.available}`;
    }
    text += `\nHistory:${history}`;
    return {
        text,
    }
}