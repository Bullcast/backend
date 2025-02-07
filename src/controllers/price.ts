import axios from "axios";
import { Body, Controller, Get, Post, Query, Route, Tags } from "tsoa";
import { env } from "../config/config";
import { client, getLendingDepositTransaction, getLendingStatus, getLendingWithdrawTransaction, getSwapTransaction, getTransferTransaction } from "./tx";
import { Transaction } from '@mysten/sui/transactions';

@Route("api/price")
export class PriceController extends Controller {
  @Get("")
  @Tags("Price")
  public async handleMessage(
    @Query() token: string,
  ) {
    try {
        const now = new Date().getTime() / 1000;
        const from = now - 3600 * 240;
        const api = `https://data.attlas.io/api/v1/chart/history?broker=ATTLAS_SPOT&symbol=${token}USDT&from=${from}&to=${now}&resolution=1h`;
        const response = await axios.get(api);
        const marketData = response.data;
        console.log(api, marketData.length);
        const marketPrice = [];
        for (const candle of marketData) {
            marketPrice.push([
                parseFloat(candle[2]),
                parseFloat(candle[3]),
                parseFloat(candle[1]),
            ]);
        }
        // predict

        const data = {
            data: marketPrice,
        };
        const predictResponse = await axios.post(env.predictApiUrl, data);
        const prediction = predictResponse.data;
        return prediction;
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
}
