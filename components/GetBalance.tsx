import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { balanceUpdateEvent } from "@/lib/events";

declare global {
  interface Window {
    starKeyWallet?: any; 
  }
}

export default function GetBalance(walletAddress:any) {
  const [balance, setBalance] = useState<number>(0);

  const getBalance = useCallback(async () => {
    if (!walletAddress) {
      setBalance(0);
      return;
    }

    try {
      const balanceSupra = await window.starKeyWallet.getBalance(walletAddress);
      setBalance(parseFloat(balanceSupra.formattedBalance))
    } catch (error) {
      toast.error("Failed to fetch balance");
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      getBalance();
    }

    const handleBalanceUpdate = () => {
      getBalance();
    };

    balanceUpdateEvent.addEventListener("balanceUpdate", handleBalanceUpdate);
    return () => {
      balanceUpdateEvent.removeEventListener("balanceUpdate", handleBalanceUpdate);
    };
  }, [walletAddress, getBalance]);

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-lg font-semibold">Balance:</span>
      <div className="flex items-center">
        <span className="mr-2">{walletAddress ? balance.toFixed(9) : 0} SUPRA</span>
      </div>
    </div>
  );
}
