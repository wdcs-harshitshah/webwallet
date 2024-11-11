"use client";

import React, { useMemo } from "react";
import { RecoilRoot } from 'recoil';
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ?? clusterApiUrl(network), [network]);

    return (
        <ConnectionProvider endpoint={endpoint} >
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    <RecoilRoot>
                        {children}
                    </RecoilRoot>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}