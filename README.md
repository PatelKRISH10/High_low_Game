## 📖 Project Overview

**Mind Reader AI** is a modern full-stack web application pitting human players against an intelligent algorithm in a duel of deduction. 

Both the Human and the AI secretly choose a number within a chosen range. They alternate taking guesses, giving honest feedback (**Higher**, **Lower**, or **Correct**), and shrinking the plausible mathematical entropy until one mind deduces the opponent's hidden number.

The system features an enterprise-grade modular AI design where game UI components are completely decoupled from decision strategies. All completed matches (especially in **Hell Mode**) are automatically harvested into a PostgreSQL database via Prisma ORM for Phase 2 Machine Learning training.

## 🕹️ Game Rules & Flow

1. **Secret Number Selection**: Human chooses a secret number within the difficulty range.
2. **AI Autonomous Selection**: AI secretly generates its target number.
3. **Initiative Coin Toss**: An animated 3D coin toss decides who takes the opening guess.
4. **Alternating Interrogation**: Players alternate turns guessing.
5. **Real-time Feedback**: Opponent responds with `Higher`, `Lower`, or `Correct`. A client-side parity check ensures human answers remain honest.
6. **Victory Condition**: The first entity to land on the exact number wins the duel.
