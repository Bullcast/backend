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
        const response = await axios.get(`https://www.binance.me/fapi/v1/markPriceKlines?symbol=${token}USDT&limit=240&interval=1h`);
        const marketData = response.data;
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
