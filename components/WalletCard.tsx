'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletIcon, CheckIcon, Copy } from "lucide-react";
import RequestAirdrop from "./RequestAirdrop";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import GetBalance from "./GetBalance";
import SignMessage from "./SignMessageCard";
import SendTokensCard from "./SendTokenCard";
import { motion } from "framer-motion";


declare global {
    interface Window {
        starkey?: {
            supra: {
                connect: (options: { network: string }) => Promise<void>;
                account: () => Promise<string[]>;
                disconnect: () => Promise<void>;
                getBalance?: () => Promise<number>;
            };
        };
    }
}

export default function WalletCard() {
    const [publicKeyCopied, setPublicKeyCopied] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
 
 const handleEIP6963AnnounceProvider = (event: MessageEvent) => {
    console.log("first", event)
    if (event.data && event.data.type === 'eip6963:announceProvider') {
        console.log("Provider announced:", event.data);
    }
};

useEffect(() => {
    window.addEventListener('message', handleEIP6963AnnounceProvider);
    return () => {
        window.removeEventListener('message', handleEIP6963AnnounceProvider);
    };
}, []);

    const connectStarKeyWallet = async () => {
        try {
            if (window?.starkey?.supra) {
                setWalletAddress(null);
                setConnected(false);
                await window.starkey.supra.connect({ network: "SUP" });
                const accounts = await window.starkey.supra.account();
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setConnected(true);
                } else {
                    console.warn("No accounts found in StarKey Wallet.");
                }
            } else {
                throw new Error("StarKey Wallet not installed.");
            }
        } catch (error: any) {
            if (error.message === "StarKey Wallet not installed.") {
                window.open(
                    "https://chromewebstore.google.com/detail/starkey-wallet-the-offici/hcjhpkgbmechpabifbggldplacolbkoh",
                    "_blank"
                );
            }
            console.error("Error connecting to StarKey Wallet:", error.message);
        }
    };
    const disconnectWallet = async () => {
        try {
            if (window?.starkey?.supra) {
                await window.starkey.supra.disconnect()
                setWalletAddress(null);
                setConnected(false);
            } else {
                console.warn("StarKey Wallet extension not found.");
            }
        } catch (error) {
            console.error("Failed to disconnect StarKey Wallet:", error);
        }
    };

    const handleCopyPublicKey = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            setPublicKeyCopied(true);
            setTimeout(() => setPublicKeyCopied(false), 2000);
        }
    };

    return (
        <div className="flex space-x-4">
            <Card className="border shadow-lg">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span className="text-2xl">Ethereum Wallet</span>
                        {connected ? (
                            <div className="flex gap-5">
                                <span className="text-gray-700">{`Connected: ${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-4)}`}</span>
                                <Button onClick={disconnectWallet} className="bg-red-500 text-white px-4 py-2 rounded">
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={connectStarKeyWallet} className="text-black px-4 py-2 rounded">
                               Connect
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {connected && (
                        <div className="mb-4 p-2 border rounded-md flex items-center justify-between">
                            <span className="text-sm font-medium truncate mr-2">{`${walletAddress?.slice(-10)}`}</span>
                            <Button size="sm" onClick={handleCopyPublicKey}>
                                {publicKeyCopied ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    )}
                    <GetBalance 
                    walletAddress={walletAddress}
                    />
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="airdrop-amount" className="block text-sm font-medium mb-1">Airdrop Amount (<span className="text-xs"> max. 50 SUP </span>)</label>
                            <RequestAirdrop
                             walletAddress={walletAddress}
                            />
                        </div>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 1.01 }}>
                    <SendTokensCard 
                    walletAddress = {walletAddress}
                    />
                </motion.div>
                       
                         <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 1.01 }}
                    className="md:col-span-2"
                >
                    <SignMessage
                    walletAddress={walletAddress}
                    />
                </motion.div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
