import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

export const client = new SuiClient({ url: getFullnodeUrl('mainnet') });