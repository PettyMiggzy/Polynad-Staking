"use client";

import React, { useMemo } from "react";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { monad } from "../lib/chains";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "";

  // Build config once. Do NOT throw if env missing (won't crash Vercel).
  const config = useMemo(() => {
    const wcId =
      projectId && projectId.length > 0
        ? projectId
        : "00000000000000000000000000000000"; // dummy so app still renders

    return getDefaultConfig({
      appName: "Polynad Staking",
      projectId: wcId,
      chains: [monad],
      transports: {
        [monad.id]: http(monad.rpcUrls.default.http[0]),
      },
      ssr: true,
    });
  }, [projectId]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#7c3aed",
            borderRadius: "large",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
