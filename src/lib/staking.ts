export const CHAIN_ID = 143;

export const POLYNAD_ADDRESS = "0x8b194601E648BD96c13A8Ddc4AdB8CDfaFc67777" as const;

// ✅ NEW V3 STAKING ADDRESS
export const STAKING_ADDRESS = "0x3e543A1DD1db7d6eaC0E89Cf1b6705d8F5BEAd70" as const;

export const NAD_LINK =
  "https://nad.fun/tokens/0x8b194601E648BD96c13A8Ddc4AdB8CDfaFc67777";

export const TOKEN_DECIMALS = 18;

export const LOCK_OPTIONS = [
  { label: "30 Days", days: 30, tier: 0 },
  { label: "90 Days", days: 90, tier: 1 },
  { label: "6 Months", days: 180, tier: 2 },
  { label: "1 Year", days: 365, tier: 3 },
] as const;
