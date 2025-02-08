// import { NAVISDKClient } from "navi-sdk";

// const client = new NAVISDKClient({networkType: "mainnet" }); 

// export const getLendingDepositTransaction = async (from: string, amount: number | string, type: string, txb?: Transaction): Promise<Buffer> => {
//   const suilendClient = await SuilendClient.initialize(LENDING_MARKET_ID, "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL", client);
//   if (typeof amount === "string") {
//     amount = parseFloat(amount);
//   }
//   if (!txb) {
//     txb = new Transaction();
//   }
//   const coinMetadata = await client.getCoinMetadata({
//     coinType: type,
//   });
//   if (coinMetadata) {
//     amount = amount * Math.pow(10, coinMetadata.decimals);
//   }

//   let obligationOwnerCaps = await SuilendClient.getObligationOwnerCaps(from, [
//     "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL"
//   ], client);

//     const coin = coinWithBalance({ balance: amount, type })

//   if (obligationOwnerCaps.length === 0) {
//     const obligationOwnerCapId = suilendClient.createObligation(
//       txb,      
//     );
//     suilendClient.deposit(coin, type, obligationOwnerCapId, txb);
//     txb.transferObjects([obligationOwnerCapId], from);
//   } else {
//     suilendClient.deposit(coin, type, obligationOwnerCaps[0].id, txb);
//   }

//   return await buildPTBTransaction(from, txb);
// }
