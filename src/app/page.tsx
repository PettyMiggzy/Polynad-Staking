"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const TOKEN = "0x8b194601E648BD96c13A8Ddc4AdB8CDfaFc67777";
const NAD_LINK = `https://nad.fun/tokens/${TOKEN}`;

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs text-white/45">{sub}</div> : null}
    </div>
  );
}

export default function Home() {
  const { isConnected, address } = useAccount();

  // mock for now
  const stats = {
    price: "$0.02168",
    change: "-4.41%",
    mcap: "$21.68K",
    vol24h: "$7.61K",
    liq: "$10.88K",
    totalStaked: "8,420,000",
    rewardPool: "420,000",
    lock: "14 days",
  };

  return (
    <main className="min-h-screen text-white">
      {/* background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#07040f]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.10),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_45%)]" />
      </div>

      {/* watermark logo */}
      <div className="pointer-events-none fixed inset-0 -z-20 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Polynad watermark"
          className="w-[720px] max-w-[92vw] opacity-[0.05] blur-[0.5px]"
        />
      </div>

      {/* header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <Image src="/logo2.png" alt="Polynad" fill className="object-cover" priority />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Polynad</div>
              <div className="text-xs text-white/60">Polynad Staking</div>
            </div>

            <nav className="ml-6 hidden items-center gap-6 md:flex">
              <a className="text-sm text-white/70 hover:text-white" href="https://v0-polynad.vercel.app/" target="_blank" rel="noreferrer">
                Markets
              </a>
              <span className="text-sm text-white/30">Dashboard</span>
            </nav>
          </div>

          <ConnectButton />
        </div>

        {/* ticker bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-5 w-5 overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
                <Image src="/logo.png" alt="logo" fill className="object-cover" />
              </div>
              <span className="font-semibold">POLYNAD</span>
              <span className="text-white/80">{stats.price}</span>
              <span className="text-red-400">{stats.change}</span>
            </div>

            <div className="hidden items-center gap-5 text-white/75 md:flex">
              <span>
                MCap: <span className="text-white">{stats.mcap}</span>
              </span>
              <span>
                Vol 24h: <span className="text-white">{stats.vol24h}</span>
              </span>
              <span>
                Liquidity: <span className="text-white">{stats.liq}</span>
              </span>
              <a className="text-purple-300 hover:text-purple-200" href="https://v0-polynad.vercel.app/" target="_blank" rel="noreferrer">
                View Chart
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* body */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Polynad <span className="text-purple-400">Staking</span>
            </h1>
            <p className="mt-4 text-white/70">
              Stake free. Early unstake pays a <span className="text-white">10% penalty</span> back into the reward pool.
              Early unstakers earn <span className="text-white">zero rewards</span>.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>Monad • Chain 143</Pill>
              <Pill>Lock: {stats.lock}</Pill>
              <Pill>Token: {TOKEN.slice(0, 8)}…{TOKEN.slice(-6)}</Pill>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={NAD_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
              >
                Get $POLYNAD
              </a>
              <a
                href="https://v0-polynad.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold hover:bg-white/[0.07]"
              >
                View Markets
              </a>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          <Stat label="Total Staked" value={stats.totalStaked} sub="POLYNAD" />
          <Stat label="Reward Pool" value={stats.rewardPool} sub="POLYNAD" />
          <Stat label="Lock" value={stats.lock} sub="Rewards after lock" />
          <Stat label="Early Unstake" value="10%" sub="Penalty returns to pool" />
        </div>

        {/* staking panel */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">Stake</div>
                <div className="mt-1 text-sm text-white/60">
                  Wiring to contract comes next — UI is ready.
                </div>
              </div>
              <Pill>Early unstake forfeits rewards</Pill>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="text-xs text-white/60">Amount (POLYNAD)</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-purple-400/40"
                  placeholder="0.0"
                  disabled={!isConnected}
                />
                <div className="mt-2 text-xs text-white/50">
                  {isConnected ? "Connected — ready." : "Connect wallet to enable staking."}
                </div>
              </div>

              <div className="grid gap-2">
                <button className="rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold hover:bg-purple-500 disabled:opacity-40" disabled={!isConnected}>
                  Stake
                </button>
                <button className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-40" disabled={!isConnected}>
                  Unstake
                </button>
                <button className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/15 disabled:opacity-40" disabled={!isConnected}>
                  Early Unstake (10%)
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-lg font-semibold">Your Dashboard</div>
            <div className="mt-1 text-sm text-white/60">
              {isConnected
                ? `Connected: ${address?.slice(0, 6)}…${address?.slice(-4)}`
                : "Connect wallet to see your position."}
            </div>

            <div className="mt-5 grid gap-3">
              <Stat label="Your Stake" value="—" sub="POLYNAD" />
              <Stat label="Time Remaining" value="—" sub="Lock countdown" />
              <Stat label="Rewards" value="—" sub="Only after lock ends" />
            </div>
          </div>
        </div>

        <footer className="mt-10 pb-10 text-center text-xs text-white/40">
          Polynad Staking • Monad (143)
        </footer>
      </section>
    </main>
  );
}
