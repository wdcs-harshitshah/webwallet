'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { emitBalanceUpdate } from "@/lib/events";

export default function SendTokensCard() {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState<number | null>(null);
    const [to, setTo] = useState('');

    async function sendTokens() {
        if (!publicKey) throw new Error('Wallet not connected!');
        if (!amount) throw new Error('Amount not specified!');
        try {
            const transaction = new Transaction();
            transaction.add(SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(to),
                lamports: amount * LAMPORTS_PER_SOL,
            }));

            await sendTransaction(transaction, connection);
            setTimeout(emitBalanceUpdate, 3000);
            toast.success("Sent " + amount + " SOL");
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    return (
        <Card className="border shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Send Tokens</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="receiver-address" className="block text-sm font-medium mb-1">Receiver Address</label>
                        <Input
                            id="receiver-address"
                            type="text"
                            placeholder="Solana address"
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="send-amount" className="block text-sm font-medium mb-1">Amount</label>
                        <Input
                            id="send-amount"
                            type="number"
                            min={0}
                            placeholder="SOL amount"
                            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value > 0) setAmount(value);
                                else setAmount(null);
                            }}
                        />
                    </div>
                    <Button
                        onClick={sendTokens}
                        disabled={!amount || !to || !connected}
                        className="w-full font-semibold"
                    >
                        <SendIcon className="mr-2 h-4 w-4" /> Send Tokens
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}