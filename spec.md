# MindForge AI Social Simulator — V5 Pass 2

## Current State

- `creatorCoins` state already exists (initialized at 100, saved/loaded from localStorage, shown in CreatorHub header)
- CreatorHub is a grid launcher with 8 tiles; no tiles for Skills, Agency, Investment, or Streaks
- No state fields exist for skill upgrades, agency, investment, streaks, or daily rewards
- Burnout system exists using postTimestampsRef but no persistent streak counter
- Rank/level system exists on profile.level but has no named rank titles in global state
- Routes exist for all existing pages; no routes for new Pass 2 pages

## Requested Changes (Diff)

### Add
- **State fields** in AppContext:
  - `skills: { contentQuality: number; engagementBoost: number; viralChance: number; brandValue: number }` (each 1–5)
  - `agency: { hired: boolean; tier: 'none' | 'basic' | 'premium' | 'elite'; revenueBoostPct: number; dealBoostPct: number; growthBoostPct: number }`
  - `investments: Investment[]` where Investment = `{ id, type: 'safe'|'risky', amount, expectedReturn, startTime, durationMs, status: 'active'|'completed'|'lost' }`
  - `loginStreak: number` (days), `lastLoginDate: string` (ISO date), `postingStreak: number`, `lastPostTime: number` (ms timestamp)
  - `dailyRewardClaimed: boolean`, `lastRewardDate: string`
  - `rank: string` (Beginner | Rising Creator | Influencer | Celebrity | Legend) derived from followers
- **New page: SkillUpgrades** (`src/frontend/src/pages/SkillUpgrades.tsx`)
  - 4 skill cards: Content Quality, Engagement Boost, Viral Chance, Brand Value
  - Each skill has levels 1–5 shown as a progress bar/dots
  - Upgrade cost increases per level (50, 100, 200, 400, 800 coins)
  - Spend creatorCoins to upgrade; button disabled if insufficient coins
  - Show current effect of each skill level
- **New page: Agency** (`src/frontend/src/pages/AgencyPage.tsx`)
  - Show current agent tier (None / Basic / Premium / Elite)
  - 3 tier cards with costs (500, 1500, 3500 coins), benefits listed (revenue % boost, deal boost, growth boost)
  - Hire/upgrade button; show active agent benefits if already hired
  - Passive revenue accrues every 30s based on agent tier
- **New page: Investment** (`src/frontend/src/pages/InvestmentPage.tsx`)
  - Safe investment options: 3 tiers (100, 500, 1000 coins, 10–20% return over 5 min)
  - Risky investment options: 3 tiers (200, 1000, 2500 coins, 50–100% return or total loss over 3 min)
  - Active investments panel showing time remaining and expected return
  - Completed investments show result (won/lost) with claim button
- **New page: StreaksRewards** (`src/frontend/src/pages/StreaksRewards.tsx`)
  - Login streak counter with 24h timer for next reward
  - Posting streak counter with 12h countdown
  - Daily reward claim button (active once per 24h)
  - Reward tiers shown (streak day 1–7+ with increasing coin rewards)
  - Grace period warning if streak about to break
- **Routes** added to App.tsx: `skills`, `agency`, `investment`, `streaks`
- **CreatorHub tiles** for all 4 new pages added to the hub grid
- **Streak/daily reward check** on app load (compare lastLoginDate to today, award login reward, update streak)
- **Posting streak update** when user creates a post (check lastPostTime, update postingStreak)
- **Skill effects wired** into engagement simulator: contentQuality boosts viral score, engagementBoost multiplies engagement, viralChance increases viral probability, brandValue boosts brand deal payouts
- **Rank display** on Profile page showing named rank based on followers
- **Coins earned notifications** when passive income, investments complete, or daily reward claimed

### Modify
- `AppContext.tsx`: add all new state fields, initialize from localStorage, persist on save
- `CreatorHub.tsx`: add 4 new tiles (Skills, Agency, Investment, Streaks & Rewards); update coins display
- `App.tsx`: add 4 new routes
- `Profile.tsx`: show rank badge/label derived from followers
- `useEngagementSimulator.tsx`: incorporate skill multipliers into calculations
- `HomeFeed.tsx` (post creation): update postingStreak on new post

### Remove
- Nothing removed

## Implementation Plan

1. Extend AppContext with all new state fields (skills, agency, investments, streaks, daily reward)
2. Add streak/daily reward check logic on mount in AppContext
3. Create SkillUpgrades page with 4 skill cards, upgrade costs, coin spending
4. Create AgencyPage with 3 tier cards, hire logic, passive income interval
5. Create InvestmentPage with safe/risky options, active investments, claim completed
6. Create StreaksRewards page with login streak, posting streak, daily claim UI
7. Wire skill multipliers into engagement simulator
8. Add rank badge to Profile page
9. Update CreatorHub with 4 new tiles
10. Add 4 new routes to App.tsx
11. Update posting streak on post creation in HomeFeed
