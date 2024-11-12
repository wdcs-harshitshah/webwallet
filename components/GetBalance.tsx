import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { balanceUpdateEvent } from "@/lib/events";
import { ethers } from "ethers";

declare global {
  interface Window {
    starKeyWallet?: any;
    ethereum?: any;
  }
}

interface GetBalanceProps {
  walletAddress: string | null;
  walletType: string | null;
}

export default function GetBalance({ walletAddress, walletType }: GetBalanceProps) {
  const [balance, setBalance] = useState<number>(0);

  const getBalance = useCallback(async () => {
    if (!walletAddress) {
      setBalance(0);
      return;
    }

    try {
      if (walletType === "starkey" && window.starkey?.supra) {
        const balanceSupra = await window.starkey.supra.balance(walletAddress);
        setBalance(parseFloat(balanceSupra.formattedBalance));
      } else if (walletType === "metamask" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceMetaMask = await provider.getBalance(walletAddress);
        setBalance(parseFloat(ethers.formatEther(balanceMetaMask)));
      }
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error(error);
    }
  }, [walletAddress, walletType]);

  useEffect(() => {
    setBalance(0);
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
  }, [walletAddress, walletType, getBalance]);

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-lg font-semibold">Balance:</span>
      <div className="flex items-center">
        <span className="mr-2">
          {walletAddress ? balance.toFixed(9) : 0} {walletType === "starkey" ? "SUPRA" : "ETH"}
        </span>
      </div>
    </div>
  );
}
