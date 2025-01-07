import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { lens } from "@goat-sdk/plugin-lens";
import { viem } from "@goat-sdk/wallet-viem";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { lens_testnet } from "./chain";

require("dotenv").config();

const account = privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(`${process.env.ALCHEMY_LENS_RPC_URL}`),
    chain: lens_testnet,
});

(async () => {
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [lens()],
    });

    const result = await generateText({
        model: openai("gpt-4o"),
        tools: tools,
        maxSteps: 5,
        prompt: "Get similar profile related to creator of post https://hey.xyz/posts/0x033026-0x0580",
    });

    console.log(result.text);
})();
