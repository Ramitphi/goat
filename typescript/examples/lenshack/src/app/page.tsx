import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import Image from "next/image";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { lens } from "@goat-sdk/plugin-lens";
import { viem } from "@goat-sdk/wallet-viem";
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { lens_testnet } from "../../chain";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
    return (
        <div className="h-screen bg-green-600 text-white grid place-items-center py-16">
            <ChatWindow />
        </div>
    );
}
