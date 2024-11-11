// 'use client'
// import { useWallet } from "@solana/wallet-adapter-react";
// import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { WalletIcon, CheckIcon, Copy } from "lucide-react";
// import RequestAirdrop from "./RequestAirdrop";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import GetBalance from "./GetBalance";
// import SignMessage from "./SignMessageCard";
// import { BrowserProvider } from "ethers";

// export default function WalletCard() {
//     const { connected, publicKey } = useWallet();
//     const [publicKeyCopied, setPublicKeyCopied] = useState(false);
//     const [walletAddress, setWalletAddress] = useState<string | null>(null);

//     const connectWallet = async () => {
//         if (typeof (window as any).ethereum !== "undefined") {
//             try {
//                 const provider = new BrowserProvider((window as any).ethereum);

//                 await (window as any).ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });

//                 await provider.send("eth_requestAccounts", []);
//                 const signer = provider.getSigner();
//                 const address = await (await signer).getAddress();
//                 setWalletAddress(address);
//             } catch (error) {
//                 console.error("Failed to connect wallet:", error);
//             }
//         } else {
//             alert("MetaMask is not installed. Please install it to use this feature.");
//         }
//     };

//     const disconnectWallet = () => {
//         setWalletAddress(null);
//     };

//     const handleCopyPublicKey = () => {
//         navigator.clipboard.writeText(publicKey?.toString() ?? '');
//         setPublicKeyCopied(true)
//         setTimeout(() => setPublicKeyCopied(false), 2000)
//     }

//     return (
//         <Card className="border shadow-lg">
//             <CardHeader>
//                 <CardTitle className="flex justify-between items-center">
//                     <span className="text-2xl">Wallet</span>
//                     {/* {connected ? (
//                         <WalletDisconnectButton />
//                     ) : (
//                         <WalletMultiButton >
//                             <WalletIcon className="mr-2 mb-0.5 h-4 w-4" /> Select Wallet
//                         </WalletMultiButton>
//                     )} */}
//                     {walletAddress ? (
//                         <div className="flex gap-2">
//                             <span className="text-gray-700">{`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
//                             <Button
//                                 onClick={disconnectWallet}
//                                 className="bg-red-500 text-white px-4 py-2 rounded"
//                             >
//                                 Disconnect
//                             </Button>
//                         </div>
//                     ) : (
//                         <Button
//                             onClick={connectWallet}
//                             className=" text-black px-4 py-2 rounded"
//                         >
//                             Connect Wallet
//                         </Button>
//                     )}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {connected && (
//                     <div className="mb-4 p-2 border rounded-md flex items-center justify-between">
//                         <span className="text-sm font-medium truncate mr-2">
//                             {publicKey?.toString()}
//                         </span>
//                         <Button
//                             size="sm"
//                             onClick={handleCopyPublicKey}
//                         >
//                             {publicKeyCopied ? (
//                                 <CheckIcon className="h-4 w-4" />
//                             ) : (
//                                 <Copy className="h-4 w-4" />
//                             )}
//                         </Button>
//                     </div>
//                 )}
//                 <GetBalance />
//                 <div className="space-y-4">
//                     <div>
//                         <label htmlFor="airdrop-amount" className="block text-sm font-medium mb-1">Airdrop Amount (<span className="text-xs"> max. 5 SOL </span>)</label>
//                         <RequestAirdrop />
//                     </div>
//                     <div>
//                         <label htmlFor="sign-message" className="block text-sm font-medium mb-1">Sign Message</label>
//                         <SignMessage />
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

'use client'
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletIcon, CheckIcon, Copy } from "lucide-react";
import RequestAirdrop from "./RequestAirdrop";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import GetBalance from "./GetBalance";
import SignMessage from "./SignMessageCard";
import { BrowserProvider } from "ethers";
interface Window {
    solana?: {
        isPhantom?: boolean;
        connect: () => Promise<void>;
        disconnect: () => Promise<void>;
        publicKey?: {
            toString: () => string;
        };
    };
}
export default function WalletCard() {
    const { connected, publicKey } = useWallet();
    const [publicKeyCopied, setPublicKeyCopied] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<'Solana' | 'Ethereum' | null>(null);

    const connectEthereumWallet = async () => {
        if (typeof (window as any).ethereum !== "undefined") {
            try {
                const provider = new BrowserProvider((window as any).ethereum);

                await (window as any).ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });

                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await (await signer).getAddress();
                setWalletAddress(address);
            } catch (error) {
                console.error("Failed to connect Ethereum wallet:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    };

    const disconnectWallet = () => {
        setWalletAddress(null);
    };

    const handleCopyPublicKey = () => {
        navigator.clipboard.writeText(publicKey?.toString() ?? '');
        setPublicKeyCopied(true);
        setTimeout(() => setPublicKeyCopied(false), 2000);
    };

    const connectSolanaWallet = async () => {
        if (typeof (window as any).solana !== "undefined") {
            try {
                await (window as any).solana.connect();
            } catch (error) {
                console.error("Failed to connect to Solana wallet:", error);
            }
        } else {
            alert("Solana wallet is not installed. Please install it to use this feature.");
        }
    };

    return (
        <div className="flex space-x-4">
            {/* Solana Wallet Card */}
            <Card className="border shadow-lg">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span className="text-2xl">Solana Wallet</span>
                        {connected ? (
                            <WalletDisconnectButton />
                        ) : (
                            <WalletMultiButton>
                                <WalletIcon onClick={connectSolanaWallet} className="mr-2 mb-0.5 h-4 w-4" />  Connect Solana Wallet
                            </WalletMultiButton>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {connected && (
                        <div className="mb-4 p-2 border rounded-md flex items-center justify-between">
                            <span className="text-sm font-medium truncate mr-2">
                                {publicKey?.toString()}
                            </span>
                            <Button size="sm" onClick={handleCopyPublicKey}>
                                {publicKeyCopied ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    )}
                    <GetBalance />
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="airdrop-amount" className="block text-sm font-medium mb-1">Airdrop Amount (<span className="text-xs"> max. 5 SOL </span>)</label>
                            <RequestAirdrop />
                        </div>
                        <div>
                            <label htmlFor="sign-message" className="block text-sm font-medium mb-1">Sign Message</label>
                            <SignMessage />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ethereum Wallet Card */}
            <Card className="border shadow-lg">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span className="text-2xl">Ethereum Wallet</span>
                        {walletAddress ? (
                            <div className="flex gap-2">
                                <span className="text-gray-700">{`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
                                <Button onClick={disconnectWallet} className="bg-red-500 text-white px-4 py-2 rounded">
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={connectEthereumWallet} className="text-black px-4 py-2 rounded">
                                Connect Wallet
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {connected && (
                        <div className="mb-4 p-2 border rounded-md flex items-center justify-between">
                            <span className="text-sm font-medium truncate mr-2">
                                {publicKey?.toString()}
                            </span>
                            <Button
                                size="sm"
                                onClick={handleCopyPublicKey}
                            >
                                {publicKeyCopied ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    )}
                    <GetBalance />
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="airdrop-amount" className="block text-sm font-medium mb-1">Airdrop Amount (<span className="text-xs"> max. 5 SOL </span>)</label>
                            <RequestAirdrop />
                        </div>
                        <div>
                            <label htmlFor="sign-message" className="block text-sm font-medium mb-1">Sign Message</label>
                            <SignMessage />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
