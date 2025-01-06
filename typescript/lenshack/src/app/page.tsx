import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import Image from "next/image";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { lens } from "@goat-sdk/plugin-lens";
import { viem } from "@goat-sdk/wallet-viem";
import { useState } from "react";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { lens_testnet } from "../../chain";

export default function Home() {
    const [prompt, setPrompt] = useState("");
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {/* <Chat userInput={"deded"} /> */}
            </main>
        </div>
    );
}
