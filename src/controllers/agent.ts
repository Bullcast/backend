import axios from "axios";
import { Body, Controller, Post, Route, Tags } from "tsoa";
import { env } from "../config/config";
import { client, getLendingDepositTransaction, getLendingStatus, getLendingWithdrawTransaction, getSwapTransaction, getTransferTransaction } from "./tx";
import { Transaction } from '@mysten/sui/transactions';

@Route("api/agent")
export class AgentController extends Controller {
  @Post("")
  @Tags("Agent")
  public async handleMessage(
    @Body() body: any,
  ) {
    try {
      const response = await axios.post(env.agent.agentApiUrl, body);
      if (response.status === 200) {
        const res = response.data.map((d: any) => {
          return {
            text: d.text,
          }
        });

        const firstAction = response.data[0].action;
        if (firstAction === 'DEFI_AUTOMATION') {
          let txb = new Transaction();
          let isTx = false;
          const contents = response.data[1].content;
          console.log(contents);
          for (const content of contents) {
            const action = content.action;
            let buffer = Buffer.alloc(0);
            try {
              switch (action) {
                case 'Transfer':
                  buffer = await getTransferTransaction(body.from, content.recipient, content.amount, txb, content.tokenType);
                  break;
                case 'Swap': 
                  buffer = await getSwapTransaction(body.from, content.fromToken, content.toToken, parseFloat(content.amount), txb, undefined);
                  break;
                case 'Suilend_Deposit':
                  buffer = await getLendingDepositTransaction(body.from, content.amount, content.tokenType, txb);
                  break;
                case 'Suilend_Withdraw':
                  buffer = await getLendingWithdrawTransaction(body.from, content.amount, content.tokenType, txb);
                  break;
                case 'Suilend_Borrow':
                  buffer = await getLendingDepositTransaction(body.from, content.amount, content.tokenType, txb);
                  break;
              }
              const uint8Array = new Uint8Array(buffer);
              txb = Transaction.from(uint8Array);
              isTx = true;
            } catch (error) {
              console.error(error);
              res[1].text = 'Failed to build transaction';
              while (res.length > 2) {
                res.pop();
              }
            }
          }
          if (isTx) {
            txb.setSenderIfNotSet(body.from);
            txb.setGasBudget(100000000);
            const builtTx = await txb.build({
              client,
            });
            // const dryrunResult = await client.dryRunTransactionBlock({
            //   transactionBlock: builtTx,
            // });
            // console.log(dryrunResult);
            // if (dryrunResult.effects.status.status === 'failure') {
            //   res[1].text = 'Failed to build & dry execute transaction';
            //   while (res.length > 2) {
            //     res.pop();
            //   }
            // } else {
              const buffer = Buffer.from(builtTx);
              res[0].payload = buffer;
            // }
          }
        } else if (firstAction === "Suilend_Check") {
          const status = await getLendingStatus(body.from);
          if (status) res.push(status); 
        } else if (firstAction === "PREDICT") {
          const prediction = response.data[1].content;
          res[1].text = `Predicted price:\nNext 1h low: ${prediction.prediction_1h[1]} high: ${prediction.prediction_1h[0]} close price: ${prediction.prediction_1h[2]}\nNext 6h low: ${prediction.prediction_6h[1]} high: ${prediction.prediction_6h[0]} close price: ${prediction.prediction_6h[2]}`;
        }
        console.log(res);
        return res;
      } else {
        throw new Error("Failed to send message to agent");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}