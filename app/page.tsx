import Navbar from "@/components/Navbar";
import WalletCard from "@/components/WalletCard";
// import WalletGenerator from "@/components/WalletGenerator";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      <Navbar />
      {/* <WalletGenerator /> */}
      <WalletCard/>
    </main>
  );
}
