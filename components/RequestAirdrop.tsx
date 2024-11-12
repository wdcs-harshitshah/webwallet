'use client';
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";
import { emitBalanceUpdate } from "@/lib/events";

declare global {
  interface Window {
    starKeyWallet?: any;  // Declare starKeyWallet interface
  }
}

export default function RequestAirdrop({ walletAddress }: { walletAddress: any }) {
  console.log(walletAddress);
  const [amount, setAmount] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const getAirdropOnClick = useCallback(async () => {
    if (!walletAddress) {
      toast.error("Wallet not connected!");
      return;
    }
    if (!amount) {
      toast.error("Amount not specified!");
      return;
    }
    if (!account) {
      toast.error("Recipient account not specified!");
      return;
    }

    const airdropPromise = async () => {
      try {
        if (!window.starKeyWallet) {
          toast.error("StarKey Wallet is not available!");
          return;
        }

        const response = await window.starKeyWallet.transferTokens({
          to: account,        
          amount: amount,      
        });

        if (response.success) {
          setTimeout(emitBalanceUpdate, 3000); 
          return "Airdrop confirmed!";
        } else {
          toast.error("Airdrop failed!");
        }
      } catch (err) {
        console.error("Airdrop error:", err);
        toast.error("Airdrop failed!");
      }
    };

    toast.promise(airdropPromise, {
      loading: "Sending airdrop...",
      success: (data) => data,
      error: (error) => error.message || "Airdrop failed!",
    });
  }, [walletAddress, amount, account]);

  return (
    <div className="flex space-x-2">
      <Input
        type="number"
        min={0}
        id="airdrop-amount"
        placeholder="Supra amount"
        className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value > 0 && value <= 50) setAmount(value);
          else setAmount(null);  
        }}
      />
      <Button onClick={getAirdropOnClick} disabled={!amount }>
        <CoinsIcon className="mr-2 h-4 w-4" /> Airdrop
      </Button>
    </div>
  );
}
