import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { balanceUpdateEvent } from "@/lib/events";

export default function GetBalance() {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [balance, setBalance] = useState(0);

    const getBalance = useCallback(async () => {
        if (!publicKey) {
            setBalance(0);
            return;
        }

        try {
            const balance = await connection.getBalance(publicKey)
            setBalance(balance / LAMPORTS_PER_SOL)
        } catch (error) {
            toast.error('Failed to fetch balance')
        }
    }, [publicKey, connection]);

    useEffect(() => {
        getBalance();

        const handleBalanceUpdate = () => {
            getBalance();
        };

        balanceUpdateEvent.addEventListener('balanceUpdate', handleBalanceUpdate);
        return () => {
            balanceUpdateEvent.removeEventListener('balanceUpdate', handleBalanceUpdate);
        };
    }, [getBalance]);

    return (
        <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Balance:</span>
            <div className="flex items-center">
                <span className="mr-2 ">{connected ? balance.toFixed(9) : 0} SOL</span>
            </div>
        </div>
    );
}