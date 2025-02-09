import { Transaction } from "@mysten/sui/transactions";
import { client } from "../ptb/index";

export const buildPTBTransaction = async (from: string, txb: Transaction, gasConfig?: number): Promise<Buffer> => {
    txb.setSenderIfNotSet(from);
    txb.setGasBudget(gasConfig || 100000000);
    const builtTx = await txb.build({
      client,
    });
    const buffer = Buffer.from(builtTx);
    return buffer;
}