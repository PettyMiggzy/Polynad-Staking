export const stakingAbi = [
  // ---------- EVENTS ----------
  {
    type: "event",
    name: "Staked",
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "tier", type: "uint8" },
      { indexed: false, name: "lockSeconds", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "Unstaked",
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "principal", type: "uint256" },
      { indexed: false, name: "reward", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "EarlyUnstaked",
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "returned", type: "uint256" },
      { indexed: false, name: "penalty", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "RewardsSynced",
    anonymous: false,
    inputs: [
      { indexed: false, name: "added", type: "uint256" },
      { indexed: false, name: "newRewardRate", type: "uint256" },
      { indexed: false, name: "periodFinish", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "RewardPaid",
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "reward", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "RewardsCompounded",
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "rewardAddedToStake", type: "uint256" },
    ],
  },

  // ---------- GLOBAL VIEWS ----------
  { type: "function", name: "totalStaked", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalStakedAllTime", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "activeStakers", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },

  // reward pool is a function in your contract
  { type: "function", name: "rewardPool", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },

  { type: "function", name: "EARLY_PENALTY_BPS", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "REWARD_DURATION", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "LOCK_DURATION", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },

  // ---------- USER VIEWS ----------
  { type: "function", name: "stakeOf", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "stakeTimestamp", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "isActiveStaker", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "bool" }] },

  { type: "function", name: "lockTier", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint8" }] },
  { type: "function", name: "lockSeconds", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint256" }] },

  { type: "function", name: "canUnstake", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "earned", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint256" }] },

  // ---------- WRITES ----------
  {
    type: "function",
    name: "stake",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "tier", type: "uint8" },
    ],
    outputs: [],
  },
  { type: "function", name: "unstake", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "earlyUnstake", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "claimRewards", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "compoundRewards", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "syncRewards", stateMutability: "nonpayable", inputs: [], outputs: [] },

  // optional helper
  { type: "function", name: "getLockDurations", stateMutability: "view", inputs: [], outputs: [{ type: "uint256[4]" }] },
] as const;
