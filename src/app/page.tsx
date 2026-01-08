"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";

import { stakingAbi } from "../lib/stakingAbi";
import {
  STAKING_ADDRESS,
  TOKEN_DECIMALS,
  NAD_LINK,
  POLYNAD_ADDRESS,
} from "../lib/staking";

function fmt(num: string, decimals = 2) {
  const n = Number(num);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-white/50">{sub}</div>
    </div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();

  const { data, isLoading } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: STAKING_ADDRESS as `0x${string}`,
        abi: stakingAbi,
        functionName: "totalStaked",
      },
      {
        address: STAKING_ADDRESS as `0x${string}`,
        abi: stakingAbi,
        functionName: "rewardPool",
      },
      {
        address: STAKING_ADDRESS as `0x${string}`,
        abi: stakingAbi,
        functionName: "totalStakedAllTime",
      },
      {
        address: STAKING_ADDRESS as `0x${string}`,
        abi: stakingAbi,
        functionName: "activeStakers",
      },
    ],
    // ✅ wagmi v2 typing-safe replacement for watch
    query: {
      refetchInterval: 15_000, // refresh every 15s
      refetchOnWindowFocus: true,
    },
  });

  const totalStakedRaw = (data?.[0]?.result ?? BigInt(0)) as bigint;
const rewardPoolRaw = (data?.[1]?.result ?? BigInt(0)) as bigint;
const totalAllTimeRaw = (data?.[2]?.result ?? BigInt(0)) as bigint;
const activeStakersRaw = (data?.[3]?.result ?? BigInt(0)) as bigint;

  const totalStaked = fmt(formatUnits(totalStakedRaw, TOKEN_DECIMALS), 2);
  const rewardPool = fmt(formatUnits(rewardPoolRaw, TOKEN_DECIMALS), 2);
  const totalAllTime = fmt(formatUnits(totalAllTimeRaw, TOKEN_DECIMALS), 2);
  const activeStakers = Number(activeStakersRaw).toLocaleString();

  return (
    <main className="min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[#07040f]" />

      {/* Watermark */}
      <div className="pointer-events-none fixed inset-0 -z-20 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Polynad watermark"
          className="w-[720px] max-w-[92vw] opacity-[0.06]"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              <Image
                src="/logo2.png"
                alt="Polynad"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Polynad</div>
              <div className="text-xs text-white/60">Polynad Staking</div>
            </div>

            {/* ONLY MARKETS */}
            <nav className="ml-6 hidden items-center gap-6 md:flex">
              <a
                className="text-sm text-white/70 hover:text-white"
                href="https://v0-polynad.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Markets
              </a>
            </nav>
          </div>

          <ConnectButton />
        </div>

        {/* Token Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-sm">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="logo" width={18} height={18} />
              <span className="font-semibold">POLYNAD</span>
              <span className="text-white/50">
                Token: {POLYNAD_ADDRESS.slice(0, 6)}…
                {POLYNAD_ADDRESS.slice(-4)}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-white/60">
              <a
                className="text-purple-300 hover:text-purple-200"
                href={NAD_LINK}
                target="_blank"
                rel="noreferrer"
              >
                Buy on NAD.fun
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Stake <span className="text-purple-400">Polynad</span> on Monad
        </h1>

        <p className="mt-4 text-white/70">
          Stake free. Early unstake pays a{" "}
          <span className="text-white">10% penalty</span> back into the reward
          pool. Early unstakers earn <span className="text-white">zero</span>{" "}
          rewards.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={NAD_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500"
          >
            Get $POLYNAD
          </a>

          <span className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
            Token: {POLYNAD_ADDRESS.slice(0, 6)}…{POLYNAD_ADDRESS.slice(-4)}
          </span>

          <span className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
            Staking: {STAKING_ADDRESS.slice(0, 6)}…{STAKING_ADDRESS.slice(-4)}
          </span>
        </div>

        {/* LIVE Stats */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard
            title="Currently Staked"
            value={isLoading ? "Loading…" : totalStaked}
            sub="POLYNAD"
          />
          <StatCard
            title="Reward Pool"
            value={isLoading ? "Loading…" : rewardPool}
            sub="POLYNAD"
          />
          <StatCard
            title="Active Stakers"
            value={isLoading ? "…" : activeStakers}
            sub="Wallets"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <StatCard
            title="Total Staked (All-Time)"
            value={isLoading ? "Loading…" : totalAllTime}
            sub="POLYNAD"
          />
          <StatCard
            title="Early Unstake Penalty"
            value="10%"
            sub="Penalty goes back into reward pool"
          />
        </div>

        {/* Stake UI */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Stake POLYNAD</div>
              <div className="mt-1 text-sm text-white/60">
                Choose a lock period. Early unstake = 10% penalty, no rewards.
              </div>
            </div>

            <span className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              Early Unstake: 10%
            </span>
          </div>

          {/* Lock Options (UI only for now) */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "30 Days", value: "30d" },
              { label: "90 Days", value: "90d" },
              { label: "6 Months", value: "180d" },
              { label: "1 Year", value: "365d" },
            ].map((lock) => (
              <button
                key={lock.value}
                disabled={!isConnected}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white/80 hover:border-purple-400/40 hover:bg-purple-500/10 disabled:opacity-40"
              >
                {lock.label}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="mt-6">
            <label className="text-xs text-white/60">Amount (POLYNAD)</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-purple-400/40"
              placeholder="0.0"
              disabled={!isConnected}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled={!isConnected}
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold hover:bg-purple-500 disabled:opacity-40"
            >
              Stake
            </button>

            <button
              disabled={!isConnected}
              className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-40"
            >
              Unstake
            </button>

            <button
              disabled={!isConnected}
              className="rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/15 disabled:opacity-40"
            >
              Early Unstake
            </button>
          </div>

          {!isConnected && (
            <div className="mt-4 text-xs text-white/50">
              Connect wallet to enable staking.
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-white/40">
          Polynad Staking • Monad (143)
        </footer>
      </section>
    </main>
  );
}
