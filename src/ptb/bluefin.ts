import { BluefinClient, Networks } from "@bluefin-exchange/bluefin-v2-client";

export async function getLPingTransaction(from: string, ATokenType: string, BTokenType: string) {
    const client = new BluefinClient(
        true,
        Networks.PRODUCTION_SUI,
    );
    await client.init();
    console.log(client.getPublicAddress())
}

getLPingTransaction("0x1", "0x2", "0x3");