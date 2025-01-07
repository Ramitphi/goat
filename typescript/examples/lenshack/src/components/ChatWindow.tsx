"use client";

import { cn } from "@/lib/utils";
import { createOpenAI } from "@ai-sdk/openai";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { lens } from "@goat-sdk/plugin-lens";
import { viem } from "@goat-sdk/wallet-viem";
import { generateText } from "ai";
import React, { useState } from "react";
import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { lens_testnet } from "../../chain";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatMessage {
    id: number;
    msg: string;
    isMe: boolean;
}

const openai = createOpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const ChatWindow = () => {
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 0,
            msg: "Welcome to Lens Agent",
            isMe: false,
        },
    ]);

    const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY}`);

    const walletClient = createWalletClient({
        account: account,
        transport: http(`${process.env.NEXT_PUBLIC_ALCHEMY_LENS_RPC_URL}`),
        chain: lens_testnet,
    });

    const sendMessageToAgent = async () => {
        setMessages((prev) => [...prev, { id: prev.length, msg: userInput, isMe: true }]);

        setUserInput("");

        setIsLoading(true);
        try {
            const tools = await getOnChainTools({
                wallet: viem(walletClient),
                plugins: [lens()],
            });

            const result = await generateText({
                model: openai("gpt-4o"),
                tools: tools,
                maxSteps: 5,
                prompt: userInput,
                // messages: messages.map(({ msg, isMe }) => ({
                //     role: isMe ? "user" : "system",
                //     content: [
                //         {
                //             type: "text",
                //             text: msg,
                //         },
                //     ],
                // })),
            });

            console.log({ aiResult: result.text }); // ai agent chat

            setMessages((prev) => [...prev, { id: prev.length, msg: result.text, isMe: false }]);
        } catch (error) {
            console.log({ error });

            const msg = (error as { message?: string })?.message;
            if (msg) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: prev.length,
                        msg,
                        isMe: false,
                    },
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-full w-1/2 min-w-[600px] bg-gradient-to-r from-pink-100 to-white rounded-lg p-2 flex flex-col overflow-auto">
            <div className="flex-1 h-96">
                {messages.map(({ id, isMe, msg }) => (
                    <div
                        key={id}
                        className={cn(
                            "bg-[#e1ffb7] text-[#084b0e] h-fit w-fit px-3 py-2 text-sm rounded-md my-2 max-w-96",
                            isMe && "bg-[#084b0e] text-white ml-auto",
                        )}
                    >
                        {msg}
                    </div>
                ))}
                {isLoading && (
                    <div className="bg-[#e1ffb7] text-[#084b0e] h-fit w-fit px-3 py-2 text-sm rounded-md my-2">
                        Thinking...
                    </div>
                )}
                {/* {Array.from({ length: 50 }, (_, index) => (
                    <div
                        key={`yo-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            index
                        }`}
                        className="bg-green-500 text-white h-fit w-fit px-3 py-2 text-sm rounded-md my-2"
                    >
                        Thinking...
                    </div>
                ))}{" "}
                <div className="bg-green-500 text-white h-fit w-fit px-3 py-2 text-sm rounded-md my-2">
                    meh
                </div> */}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessageToAgent();
                }}
                className="fixed w-1/2 min-w-[600px] left-1/2 -translate-x-1/2 bottom-6 flex gap-2 bg-gradient-to-r from-pink-100 to-white p-1 rounded"
            >
                <Input
                    placeholder="Type your prompt here"
                    className="text-black"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <Button type="submit" className="bg-[#084b0e] text-white">
                    Enter
                </Button>
            </form>
        </div>
    );
};

export default ChatWindow;
