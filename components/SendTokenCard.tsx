'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { emitBalanceUpdate } from "@/lib/events";

export default function SendTokensCard({ walletAddress }: { walletAddress: any }) {
    console.log("WALLETADDRESS", walletAddress);

    const [amount, setAmount] = useState<number | null>(null);
    const [to, setTo] = useState('');

    // Function to send Supra tokens
    async function sendTokens() {
        if (!walletAddress) {
            toast.error('Wallet not connected!');
            return;
        }
        if (!amount) {
            toast.error('Amount not specified!');
            return;
        }
        if (!to) {
            toast.error('Receiver address not specified!');
            return;
        }

        try {
            if (!window.starKeyWallet) {
                throw new Error("StarKey Wallet is not available!");
            }
const tx = {
    to: to,   
    amount: amount, 
    token:'SUPRA'
}
console.log("to",to)
console.log(amount)
const transaction = await window.starKeyWallet?.sendTokenAmount(tx);
            console.log("🚀 ~ sendTokens ~ transaction:", transaction)

            if (transaction) {
                
                setTimeout(emitBalanceUpdate, 3000); 
                toast.success(`Sent ${amount} SUP to ${to}`);
            } else {
                toast.error("Transaction failed.");
            }
        } catch (err: any) {
            console.error("Send Tokens Error:", err);
            toast.error("An error occurred while sending tokens.");
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
                            placeholder="Supra address"
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="send-amount" className="block text-sm font-medium mb-1">Amount</label>
                        <Input
                            id="send-amount"
                            type="number"
                            min={0}
                            placeholder="SUP amount"
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
                        disabled={!amount || !to || !walletAddress}
                        className="w-full font-semibold"
                    >
                        <SendIcon className="mr-2 h-4 w-4" /> Send Tokens
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
