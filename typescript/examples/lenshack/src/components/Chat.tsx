// import { openai } from "@ai-sdk/openai";
// import { generateText } from "ai";
// import Image from "next/image";

// import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
// import { lens } from "@goat-sdk/plugin-lens";
// import { viem } from "@goat-sdk/wallet-viem";
// import React, { FC } from "react";
// import { http } from "viem";
// import { createWalletClient } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
// import { lens_testnet } from "../../../chain";

// type Props = {
//     userInput: string;
// };

// // TOODODODO

// const Chat: FC<{ gg: Props }> = ({ gg }) => {
//     require("dotenv").config();

//     const account = privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}`);

//     const walletClient = createWalletClient({
//         account: account,
//         transport: http(`${process.env.ALCHEMY_LENS_RPC_URL}`),
//         chain: lens_testnet,
//     });

//     let response;
//     (async () => {
//         const tools = await getOnChainTools({
//             wallet: viem(walletClient),
//             plugins: [lens()],
//         });

//         const result = await generateText({
//             model: openai("gpt-4o"),
//             tools: tools,
//             maxSteps: 5,
//             prompt: gg.userInput,

//             // userr input
//         });

//         response = result.text;
//         console.log(result.text); // ai agent chat
//     })();

//     return (
//         <div>
//             <p> {response}</p>
//         </div>
//     );
// };

// export default Chat;
