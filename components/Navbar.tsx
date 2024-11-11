'use client'
import { Box } from "lucide-react";
import React, { useState } from "react";
import { ModeToggle } from "./ui/theme-button";
import { BrowserProvider } from "ethers";
import { Button } from "./ui/button";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new BrowserProvider((window as any).ethereum);

        await (window as any).ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await (await signer).getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null); 
  };


  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center gap-2">
        <Box className="size-8" />
        <div className="flex flex-col gap-4">
          <span className="tracking-tighter text-3xl font-extrabold text-primary flex gap-2 items-center">
            My Web 3 Wallet
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
      {walletAddress ? (
          <div className="flex gap-2">
            <span className="text-gray-700">{`Connected: ${walletAddress.slice(0, 32)}...${walletAddress.slice(-4)}`}</span>
            <Button
              onClick={disconnectWallet}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            className=" text-black px-4 py-2 rounded"
          >
            Connect Wallet
          </Button>
        )}
      <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
