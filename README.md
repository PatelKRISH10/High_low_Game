# 🧠 Mind Reader AI

> **A high-stakes cognitive number guessing battle between Human intuition and AI heuristics.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 📖 Project Overview

**Mind Reader AI** is a modern full-stack web application pitting human players against an intelligent algorithm in a duel of deduction. 

Both the Human and the AI secretly choose a number within a chosen range. They alternate taking guesses, giving honest feedback (**Higher**, **Lower**, or **Correct**), and shrinking the plausible mathematical entropy until one mind deduces the opponent's hidden number.

The system features an enterprise-grade modular AI design where game UI components are completely decoupled from decision strategies. All completed matches (especially in **Hell Mode**) are automatically harvested into a PostgreSQL database via Prisma ORM for Phase 2 Machine Learning training.

---

## 🕹️ Game Rules & Flow

```mermaid
flowchart LR
    A[Select Difficulty] --> B[Human Picks Secret]
    B --> C[AI Generates Secret]
    C --> D[Random Coin Toss]
    D --> E[Alternating Guess Turns]
    E -->|Higher / Lower| E
    E -->|Correct Guess| F[Victory & DB Persistence]
```

1. **Secret Number Selection**: Human chooses a secret number within the difficulty range.
2. **AI Autonomous Selection**: AI secretly generates its target number.
3. **Initiative Coin Toss**: An animated 3D coin toss decides who takes the opening guess.
4. **Alternating Interrogation**: Players alternate turns guessing.
5. **Real-time Feedback**: Opponent responds with `Higher`, `Lower`, or `Correct`. A client-side parity check ensures human answers remain honest.
6. **Victory Condition**: The first entity to land on the exact number wins the duel.

---

## ⚡ Game Modes

| Difficulty | Search Range | AI Strategy Profile | Data Pipeline |
| :--- | :--- | :--- | :--- |
| **Easy** | `1 - 100` | **Binary Search with Random Finish**: Standard midpoint splits. When remaining possibilities drop below 10, switches to stochastic guessing. | Standard Logging |
| **Normal** | `1 - 1,000` | **Binary Search + Human Psychological Heuristics**: Evaluates round numbers, repeated digits (111, 222, 777), sequences (123, 234), and multiples of 5/10. | Standard Logging |
| **Hell** | `1 - 10,000` | **Heuristic Engine + High-Vast Search Space**: Designed for ML dataset collection. Every turn trace is saved to PostgreSQL for policy training. | **Active ML Training Ingestion** |

---

## 🏛️ Clean Architecture

The codebase adheres strictly to separation of concerns. UI components **never** implement game theory or AI heuristics directly:

```
├── app/
│   ├── api/
│   │   ├── games/route.ts      # REST handler for recording matches & fetching history
│   │   └── stats/route.ts      # Aggregated performance metrics across difficulties
│   ├── globals.css             # Dark theme, glassmorphic styles, custom scrollbars
│   ├── layout.tsx              # Root HTML shell & ambient glow backdrops
│   └── page.tsx                # Clean view orchestrator (zero business logic)
│
├── components/                 # Reusable Presentation Components
│   ├── CoinTossModal.tsx       # Animated initiative toss
│   ├── DifficultyCards.tsx     # Mode selector with ambient glow cards
│   ├── GameArena.tsx           # Dual-perspective turn arena
│   ├── GuessHistory.tsx        # Timeline of moves with filter pills
│   ├── Navbar.tsx              # Top navigation & system status
│   ├── RangeProgressCard.tsx   # Real-time search space entropy reduction gauges
│   ├── RulesModal.tsx          # Game rule modal
│   ├── RulesSection.tsx        # Visual step-by-step game guide
│   ├── SecretSelectionCard.tsx # Secret number lock-in with visibility toggle & randomizer
│   ├── StatisticsModal.tsx     # Global win-rate dashboard
│   └── WinnerModal.tsx         # Victory celebration modal with confetti
│
├── hooks/
│   └── useMindReaderGame.ts    # Centralized headless game state engine
│
├── lib/
│   ├── ai/                     # AI Decision Engine (Completely isolated)
│   │   ├── AIEngine.ts         # Singleton facade consumed by UI (AIEngine.getNextGuess)
│   │   ├── EasyStrategy.ts     # Midpoint + random finish algorithm
│   │   ├── NormalStrategy.ts   # Human preference biased binary search
│   │   ├── MLStrategy.ts       # Drop-in Neural Policy Strategy skeleton
│   │   ├── StrategyInterface.ts# Strict strategy contract
│   │   ├── GameMemory.ts       # State boundary & history tracker
│   │   ├── GameRecorder.ts     # Turn buffering and backend telemetry
│   │   └── HumanPreference.ts  # Isolated psychological heuristic weights
│   ├── server/
│   │   └── gameService.ts      # PostgreSQL persistence & fallback in-memory cache
│   └── prisma.ts               # Global Prisma client singleton
│
├── prisma/
│   └── schema.prisma           # Game, GameTurn, and Statistics schemas
│
├── types/
│   └── game.ts                 # Strict TypeScript contracts & difficulty configs
│
└── utils/
    └── gameUtils.ts            # Formatting & entropy reduction calculation helpers
```

---

## 🤖 Future-Ready AI Modular Design

The UI **only** interacts with `AIEngine.getNextGuess()`. 

To replace `NormalStrategy` with a Machine Learning model in Hell mode:

1. Implement `calculateGuess(memory: GameMemory): number` in `lib/ai/MLStrategy.ts`.
2. Connect to your ONNX, TensorFlow.js, or cloud inference endpoint.
3. Zero modifications required in any UI component or React hook!

```typescript
// Hot-swap strategy dynamically:
const engine = AIEngine.getInstance();
engine.setStrategy('hell', new MLStrategy('https://api.your-ml-model.com/predict'));
```

---

## 🗄️ Database Schema (Prisma ORM)

Compatible with **Neon PostgreSQL**, **Supabase**, or local Postgres:

```prisma
model Game {
  id          String     @id @default(cuid())
  difficulty  String
  winner      String
  humanSecret Int
  aiSecret    Int
  totalTurns  Int
  createdAt   DateTime   @default(now())
  turns       GameTurn[]

  @@index([difficulty])
  @@index([createdAt])
}

model GameTurn {
  id           String   @id @default(cuid())
  gameId       String
  turnNumber   Int
  player       String
  guess        Int
  response     String
  remainingMin Int
  remainingMax Int
  createdAt    DateTime @default(now())

  game Game @relation(fields: [gameId], references: [id], onDelete: Cascade)

  @@index([gameId])
  @@index([turnNumber])
}

model Statistics {
  id           String   @id @default(cuid())
  difficulty   String   @unique
  gamesPlayed  Int      @default(0)
  humanWins    Int      @default(0)
  aiWins       Int      @default(0)
  averageTurns Float    @default(0.0)
  updatedAt    DateTime @updatedAt
}
```

> **Resilience Guarantee:** If `DATABASE_URL` is omitted during local development, the app smoothly falls back to an in-memory repository without throwing unhandled exceptions.

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/mind-reader-ai.git
cd mind-reader-ai
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Neon / Supabase Connection Strings
DATABASE_URL="postgresql://user:password@host-pooler.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@host.tech/neondb?sslmode=require"
```

### 3. Initialize Prisma Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema directly to database (Neon / Supabase)
npm run prisma:push

# (Optional) Open visual database studio
npm run prisma:studio
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Vercel

1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL` (Pooled PostgreSQL URL from Neon or Supabase)
   - `DIRECT_URL` (Direct PostgreSQL URL for Prisma migrations)
4. Build Command defaults to: `prisma generate && next build`.
5. Click **Deploy**. Your app is live!

---

## 🗺️ Future Roadmap

- [x] Phase 1: High-Low dual arena with Easy and Normal heuristic AI.
- [x] Phase 1: Comprehensive Hell mode telemetry recording to PostgreSQL.
- [ ] Phase 2: PyTorch/ONNX model trained on recorded game histories to predict human preference distributions.
- [ ] Phase 2: Difficulty dynamic scaling based on human response delay and hesitation patterns.
- [ ] Phase 3: Multiplayer 1v1 Room Battles via WebSockets.

---

## 📄 License

MIT © Mind Reader AI

