import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { emitBalanceUpdate } from "@/lib/events";
import { ethers } from "ethers";

export default function SendTokensCard({ walletAddress, walletType }: any) {
    console.log(walletType);
    const [amount, setAmount] = useState<number | null>(null);
    const [to, setTo] = useState('');

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
            if (walletType === "starkey" && window.starkey) {
                const tx = {
                    data: "",
                    from: walletAddress,
                    to: to,
                    value: amount,
                    chainId: 6
                };

                console.log("🚀 ~ sendTokens ~ StarKey transaction params:", tx);

                const transaction = await window.starkey?.supra?.sendTransaction(tx);
                console.log("🚀 ~ sendTokens ~ StarKey transaction:", transaction);

                if (transaction) {
                    setTimeout(emitBalanceUpdate, 3000);
                    toast.success(`Sent ${amount} SUP to ${to}`);
                } else {
                    toast.error("Transaction failed.");
                }
            } else if (walletType === "metamask" && window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);

                const accounts = await provider.send("eth_accounts", []);
                if (accounts.length === 0) {
                    toast.error("MetaMask is not connected!");
                    return;
                }

                await provider.send("eth_requestAccounts", []);

                const signer = await provider.getSigner();
                const tx = {
                    to: to,
                    value: ethers.parseEther(amount.toString())
                };

                console.log("🚀 ~ sendTokens ~ MetaMask transaction params:", tx);

                const transaction = await signer.sendTransaction(tx);
                console.log("🚀 ~ sendTokens ~ MetaMask transaction:", transaction);

                if (transaction) {
                    setTimeout(emitBalanceUpdate, 3000);
                    toast.success(`Sent ${amount} ETH to ${to}`);
                } else {
                    toast.error("Transaction failed.");
                }
            } else {
                toast.error("Unsupported wallet type or wallet not available.");
            }
        } catch (err: any) {
            console.error("Send Tokens Error:", err);
            toast.error(`An error occurred while sending tokens: ${err.message || err}`);
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
