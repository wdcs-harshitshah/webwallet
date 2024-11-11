import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";
import { emitBalanceUpdate } from "@/lib/events";

export default function RequestAirdrop() {
    const [amount, setAmount] = useState<number | null>(null);
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection();

    const getAirdropOnClick = useCallback(async () => {
        if (!publicKey) throw new Error('Wallet not connected!');
        if (!amount) throw new Error('Amount not specified!');

        const airdropPromise = async () => {
            try {
                await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
                setTimeout(emitBalanceUpdate, 3000);
                return "Airdrop confirmed!";
            } catch (err) {
                toast.error("Airdrop failed!");
            }
        }
        toast.promise(airdropPromise, {
            loading: 'Loading...',
            success: (data) => data,
        });
    }, [publicKey, connection, amount]);

    return (
        <div className="flex space-x-2">
            <Input
                type="number"
                min={0}
                id="airdrop-amount"
                placeholder="SOL amount"
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > 0 && value <= 5) setAmount(value);
                    else setAmount(null);
                }} />
            <Button
                onClick={getAirdropOnClick}
                disabled={!amount || !connected}>
                <CoinsIcon className="mr-2 h-4 w-4" /> Airdrop
            </Button>
        </div>
    )

}