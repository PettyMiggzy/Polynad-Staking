"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";

import { stakingAbi } from "../lib/stakingAbi";
import { erc20Abi } from "../lib/erc20Abi";
import {
  STAKING_ADDRESS,
  TOKEN_DECIMALS,
  NAD_LINK,
  POLYNAD_ADDRESS,
  LOCK_OPTIONS,
} from "../lib/staking";

function fmt(num: string, decimals = 2) {
  const n = Number(num);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

function secondsToHuman(seconds: number) {
  if (seconds <= 0) return "0s";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
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
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [tier, setTier] = useState<number>(0);
  const [status, setStatus] = useState("");

  const contracts = useMemo(() => {
    const addr = address as `0x${string}` | undefined;

    return [
      // global
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "totalStaked" },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "rewardPool" },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "totalStakedAllTime" },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "activeStakers" },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "EARLY_PENALTY_BPS" },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "REWARD_DURATION" },

      // user
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "stakeOf", args: addr ? [addr] : undefined },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "stakeTimestamp", args: addr ? [addr] : undefined },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "lockSeconds", args: addr ? [addr] : undefined },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "lockTier", args: addr ? [addr] : undefined },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "canUnstake", args: addr ? [addr] : undefined },
      { address: STAKING_ADDRESS, abi: stakingAbi, functionName: "earned", args: addr ? [addr] : undefined },

      // token ux
      { address: POLYNAD_ADDRESS, abi: erc20Abi, functionName: "balanceOf", args: addr ? [addr] : undefined },
      { address: POLYNAD_ADDRESS, abi: erc20Abi, functionName: "allowance", args: addr ? [addr, STAKING_ADDRESS] : undefined },
    ] as const;
  }, [address]);

  const { data, isLoading, refetch } = useReadContracts({
    allowFailure: true,
    contracts: contracts as any,
    query: { refetchInterval: 12_000, refetchOnWindowFocus: true },
  });

  const totalStakedRaw = (data?.[0]?.result ?? BigInt(0)) as bigint;
  const rewardPoolRaw = (data?.[1]?.result ?? BigInt(0)) as bigint;
  const totalAllTimeRaw = (data?.[2]?.result ?? BigInt(0)) as bigint;
  const activeStakersRaw = (data?.[3]?.result ?? BigInt(0)) as bigint;
  const penaltyBpsRaw = (data?.[4]?.result ?? BigInt(1000)) as bigint;
  const rewardDurationRaw = (data?.[5]?.result ?? BigInt(0)) as bigint;

  const myStakeRaw = (data?.[6]?.result ?? BigInt(0)) as bigint;
  const myStakeTsRaw = (data?.[7]?.result ?? BigInt(0)) as bigint;
  const myLockSecRaw = (data?.[8]?.result ?? BigInt(0)) as bigint;
  const myTierRaw = (data?.[9]?.result ?? 0) as number;
  const canUnstake = (data?.[10]?.result ?? false) as boolean;
  const earnedRaw = (data?.[11]?.result ?? BigInt(0)) as bigint;

  const myBalanceRaw = (data?.[12]?.result ?? BigInt(0)) as bigint;
  const allowanceRaw = (data?.[13]?.result ?? BigInt(0)) as bigint;

  const totalStaked = fmt(formatUnits(totalStakedRaw, TOKEN_DECIMALS), 2);
  const rewardPool = fmt(formatUnits(rewardPoolRaw, TOKEN_DECIMALS), 2);
  const totalAllTime = fmt(formatUnits(totalAllTimeRaw, TOKEN_DECIMALS), 2);
  const activeStakers = Number(activeStakersRaw).toLocaleString();

  const earlyPenaltyPct = Number(penaltyBpsRaw) / 100;
  const rewardDurationDays = Number(rewardDurationRaw) ? (Number(rewardDurationRaw) / 86400).toFixed(1) : "—";

  const myStake = fmt(formatUnits(myStakeRaw, TOKEN_DECIMALS), 6);
  const myBalance = fmt(formatUnits(myBalanceRaw, TOKEN_DECIMALS), 6);
  const myEarned = fmt(formatUnits(earnedRaw, TOKEN_DECIMALS), 6);

  const nowSec = Math.floor(Date.now() / 1000);
  const stakeTs = Number(myStakeTsRaw);
  const lockSec = Number(myLockSecRaw);
  const unlockAt = stakeTs > 0 ? stakeTs + (lockSec || 0) : 0;
  const secondsLeft = unlockAt > 0 ? unlockAt - nowSec : 0;

  const needsApproval = useMemo(() => {
    try {
      const amt = amount.trim();
      if (!amt || Number(amt) <= 0) return false;
      const amtWei = parseUnits(amt as `${number}`, TOKEN_DECIMALS);
      return allowanceRaw < amtWei;
    } catch {
      return false;
    }
  }, [amount, allowanceRaw]);

  async function handleStake() {
    if (!isConnected || !address) return;
    setStatus("");

    try {
      const amt = amount.trim();
      if (!amt || Number(amt) <= 0) return setStatus("Enter an amount.");

      const amtWei = parseUnits(amt as `${number}`, TOKEN_DECIMALS);

      if (myBalanceRaw < amtWei) return setStatus("Not enough POLYNAD balance.");

      if (allowanceRaw < amtWei) {
        setStatus("Approving POLYNAD…");
        await writeContractAsync({
          address: POLYNAD_ADDRESS,
          abi: erc20Abi,
          functionName: "approve",
          args: [STAKING_ADDRESS, amtWei],
        });
      }

      setStatus("Staking…");
      await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: "stake",
        args: [amtWei, tier],
      });

      setStatus("✅ Staked!");
      setAmount("");
      await refetch();
    } catch (e: any) {
      setStatus(e?.shortMessage || e?.message || "Stake failed.");
    }
  }

  async function handleUnstake() {
    if (!isConnected) return;
    setStatus("");

    try {
      setStatus("Unstaking…");
      await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: "unstake",
        args: [],
      });
      setStatus("✅ Unstaked!");
      await refetch();
    } catch (e: any) {
      setStatus(e?.shortMessage || e?.message || "Unstake failed.");
    }
  }

  async function handleEarlyUnstake() {
    if (!isConnected) return;
    setStatus("");

    try {
      setStatus("Early unstaking…");
      await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: "earlyUnstake",
        args: [],
      });
      setStatus("✅ Early unstaked (penalty applied)!");
      await refetch();
    } catch (e: any) {
      setStatus(e?.shortMessage || e?.message || "Early unstake failed.");
    }
  }

  async function handleClaim() {
    if (!isConnected) return;
    setStatus("");
    try {
      setStatus("Claiming rewards…");
      await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: "claimRewards",
        args: [],
      });
      setStatus("✅ Claimed!");
      await refetch();
    } catch (e: any) {
      setStatus(e?.shortMessage || e?.message || "Claim failed.");
    }
  }

  async function handleCompound() {
    if (!isConnected) return;
    setStatus("");
    try {
      setStatus("Compounding…");
      await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: "compoundRewards",
        args: [],
      });
      setStatus("✅ Compounded!");
      await refetch();
    } catch (e: any) {
      setStatus(e?.shortMessage || e?.message || "Compound failed.");
    }
  }

  async function handleSyncRewards() {
    setStatus("");
    try {
      setStatus("Syncing rewards…");
      await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: "syncRewards",
        args: [],
      });
      setStatus("✅ Synced!");
      await refetch();
    } catch (e: any) {
      setStatus(e?.shortMessage || e?.message || "Sync failed.");
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-[#07040f]" />
      <div className="pointer-events-none fixed inset-0 -z-20 flex items-center justify-center">
        <img src="/logo.png" alt="Polynad watermark" className="w-[720px] max-w-[92vw] opacity-[0.06]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              <Image src="/logo2.png" alt="Polynad" fill className="object-cover" priority />
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Polynad</div>
              <div className="text-xs text-white/60">Polynad Staking</div>
            </div>
          </div>
          <ConnectButton />
        </div>

        <div className="border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-sm">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="logo" width={18} height={18} />
              <span className="font-semibold">POLYNAD</span>
              <span className="text-white/50">
                Token: {POLYNAD_ADDRESS.slice(0, 6)}…{POLYNAD_ADDRESS.slice(-4)}
              </span>
            </div>
            <a className="hidden md:inline text-purple-300 hover:text-purple-200" href={NAD_LINK} target="_blank" rel="noreferrer">
              Buy on NAD.fun
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Stake <span className="text-purple-400">Polynad</span> on Monad
        </h1>

        <p className="mt-4 text-white/70">
          Time-weighted rewards. Rewards only count from deposits made after you stake. Early unstake pays{" "}
          <span className="text-white">{earlyPenaltyPct.toFixed(2)}%</span> penalty and forfeits rewards.
          <span className="ml-2 text-white/50">(Rewards stream: {rewardDurationDays} days)</span>
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard title="Currently Staked" value={isLoading ? "Loading…" : totalStaked} sub="POLYNAD" />
          <StatCard title="Reward Pool" value={isLoading ? "Loading…" : rewardPool} sub="POLYNAD" />
          <StatCard title="Active Stakers" value={isLoading ? "…" : activeStakers} sub="Wallets" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <StatCard title="Total Staked (All-Time)" value={isLoading ? "Loading…" : totalAllTime} sub="POLYNAD" />
          <StatCard title="Your Earned" value={isConnected ? myEarned : "—"} sub="POLYNAD" />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">Stake POLYNAD</div>
              <div className="mt-1 text-sm text-white/60">Choose a lock tier. Approve + stake.</div>
            </div>
            <div className="text-sm text-white/70">
              Balance: <span className="text-white">{isConnected ? myBalance : "—"}</span> POLYNAD
            </div>
          </div>

          {/* tiers */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {LOCK_OPTIONS.map((opt) => (
              <button
                key={opt.tier}
                disabled={!isConnected}
                onClick={() => setTier(opt.tier)}
                className={[
                  "rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-40",
                  tier === opt.tier
                    ? "border-purple-400/50 bg-purple-500/15 text-white"
                    : "border-white/10 bg-black/30 text-white/80 hover:border-purple-400/40 hover:bg-purple-500/10",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* amount */}
          <div className="mt-6">
            <label className="text-xs text-white/60">Amount to stake</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-purple-400/40"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isConnected}
            />
            <div className="mt-2 text-xs text-white/50">
              {needsApproval ? "Will approve token first, then stake." : "Ready to stake."}
            </div>
          </div>

          {/* user stake */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard title="Your Staked" value={isConnected ? myStake : "—"} sub="POLYNAD" />
            <StatCard
              title="Unlock In"
              value={
                !isConnected || stakeTs === 0
                  ? "—"
                  : secondsLeft <= 0
                  ? "Unlocked"
                  : secondsToHuman(secondsLeft)
              }
              sub={
                !isConnected || stakeTs === 0
                  ? "No active stake"
                  : secondsLeft <= 0
                  ? "You can unstake now"
                  : `Unlocks at ${new Date(unlockAt * 1000).toLocaleString()}`
              }
            />
            <StatCard
              title="Tier"
              value={!isConnected || stakeTs === 0 ? "—" : `${myTierRaw}`}
              sub={!isConnected || stakeTs === 0 ? "" : `${Math.round(lockSec / 86400)} days`}
            />
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled={!isConnected}
              onClick={handleStake}
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold hover:bg-purple-500 disabled:opacity-40"
            >
              {needsApproval ? "Approve + Stake" : "Stake"}
            </button>

            <button
              disabled={!isConnected}
              onClick={handleUnstake}
              className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-40"
            >
              Unstake
            </button>

            <button
              disabled={!isConnected}
              onClick={handleEarlyUnstake}
              className="rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/15 disabled:opacity-40"
            >
              Early Unstake
            </button>

            <button
              disabled={!isConnected || earnedRaw === BigInt(0)}
              onClick={handleClaim}
              className="rounded-xl border border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40"
            >
              Claim
            </button>

            <button
              disabled={!isConnected || earnedRaw === BigInt(0)}
              onClick={handleCompound}
              className="rounded-xl border border-purple-400/20 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-200 hover:bg-purple-500/15 disabled:opacity-40"
            >
              Compound
            </button>

            <button
              onClick={handleSyncRewards}
              className="rounded-xl border border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Sync Rewards
            </button>

            <button
              onClick={async () => {
                setStatus("Refreshing…");
                await refetch();
                setStatus("");
              }}
              className="rounded-xl border border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          {status && (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
              {status}
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-white/40">Polynad Staking • Monad (143)</footer>
      </section>
    </main>
  );
}
