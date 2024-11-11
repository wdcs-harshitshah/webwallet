import Body from "@/components/Body";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      <Navbar />
      {/* <WalletGenerator /> */}
      <Body />
    </main>
  );
}
