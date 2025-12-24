# Game State Machine Implementation Guide

## 📋 Overview

I've created a **CQRS-style game state machine** that manages the complex lifecycle of football games with proper permission checks and state transition validation.

### Files Created/Modified:

1. **[src/config.ts](src/config.ts)** - Updated enums

   - `GAME_STATUS`: voting → live → finished (or cancelled)
   - `LIVE_GAME_STATUS`: Only relevant when status="live"

2. **[src/app/[locale]/(authenticated)/games/types.ts](<src/app/[locale]/(authenticated)/games/types.ts>)** - Updated IGame interface

3. **[src/app/api/games/gameStateMachine.ts](src/app/api/games/gameStateMachine.ts)** - Core state machine ⭐

   - `GameStateMachine` class with all command methods
   - Permission validation
   - State transition validation

4. **[src/app/api/games/[id]/commands/route.ts](src/app/api/games/[id]/commands/route.ts)** - API endpoint

   - Handles incoming commands
   - Persists to Supabase
   - Ready for Realtime sync

5. **[src/utils/gameCommands.ts](src/utils/gameCommands.ts)** - Frontend helpers
   - `executeGameCommand()` function
   - `useGameCommand()` React hook

---

## 🎮 Game Status Lifecycle

```
voting
    ↓
   live (with live_game_status = waiting_for_kickoff)
    ↓
   [various transitions below]
    ↓
finished
```

### Live Game Status Transitions:

```
waiting_for_kickoff
    ↓ kickoff()
in_progress ←──────┐
    ↓              │
    ├─→ paused ────┤ resumeGame()
    │              │
    ├─→ halftime ──┤
    │    ↓         │
    │    waiting_for_second_half
    │    ↓
    │    in_progress ─┘
    │
    └─→ ended
        ↓ finishGame()
    finished
```

---

## 🔐 Permission Model

Access to modify live status requires **at least one of**:

- ✅ User role is `admin` (global developer)
- ✅ User role is `moderator` (global)
- ✅ User is in the game's `moderators` array

Players (`USER_ROLE.player`) can only:

- View games
- NOT modify live_game_status

---

## 📡 Available Commands

### Game Lifecycle Commands:

| Command      | State Transition  | Description                                         |
| ------------ | ----------------- | --------------------------------------------------- |
| `startGame`  | voting → live     | Move game from voting to live (waiting_for_kickoff) |
| `finishGame` | live → finished   | Mark game as completely finished                    |
| `cancelGame` | (any) → cancelled | Cancel a game with optional reason                  |

### Live Match Commands (only when status="live"):

| Command            | Transition                            | Description                 |
| ------------------ | ------------------------------------- | --------------------------- |
| `kickoff`          | waiting_for_kickoff → in_progress     | Start the match             |
| `pauseGame`        | in_progress → paused                  | Pause (injury, break, etc.) |
| `resumeGame`       | paused → in_progress                  | Resume from pause           |
| `startHalftime`    | in_progress → halftime                | Begin halftime              |
| `endHalftime`      | halftime → waiting_for_second_half    | End halftime break          |
| `resumeSecondHalf` | waiting_for_second_half → in_progress | Resume second half          |
| `endGame`          | in_progress/paused → ended            | End the match               |

### Data Commands:

| Command      | Description                                  |
| ------------ | -------------------------------------------- |
| `recordMove` | Record a goal/move (only during in_progress) |

---

## 💻 Backend Usage Example

```typescript
// In your API route handler
import { GameStateMachine } from "../gameStateMachine";
import { USER_ROLE } from "@/store/auth";

// Initialize the state machine
const stateMachine = new GameStateMachine(game, userId, userRole);

// Execute a command
const result = stateMachine.kickoff();

if (result.success) {
  // Update database with result.data
  const updated = await supabase
    .from("games")
    .update(result.data)
    .eq("id", gameId);
} else {
  // Handle error: result.error
  console.error(result.error);
}
```

---

## 🎯 Frontend Usage Example

### Using the utility function:

```typescript
import { executeGameCommand } from "@/utils/gameCommands";

// Start the game
const result = await executeGameCommand(gameId, "startGame");
if (result.success) {
  console.log("Game started!", result.game);
}

// Record a goal
const moveResult = await executeGameCommand(gameId, "recordMove", {
  scorer_id: "player-123",
  is_scorer_goalkeeper: false,
  assist_id: "player-456",
  is_assist_goalkeeper: false,
  time: 45,
  type: "regular_goal",
  assist_type: "regular_play",
});
```

### Using the React hook:

```typescript
import { useGameCommand } from '@/utils/gameCommands';

export function GameControls({ gameId }: { gameId: string }) {
  const { executeCommand, isLoading, error } = useGameCommand(gameId);

  const handleKickoff = async () => {
    await executeCommand('kickoff');
    if (error) {
      toast.error(error);
    } else {
      toast.success('Match started!');
    }
  };

  return (
    <button onClick={handleKickoff} disabled={isLoading}>
      {isLoading ? 'Starting...' : 'Kickoff'}
    </button>
  );
}
```

---

## 🔄 Real-time Sync with Supabase

The API endpoint automatically updates the database. To sync across all connected clients:

### Enable Realtime in Supabase:

1. Go to Supabase console → Replication
2. Enable for the `games` table

### Frontend subscription:

```typescript
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const channel = supabase
  .channel(`game:${gameId}`)
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "games",
      filter: `id=eq.${gameId}`,
    },
    (payload) => {
      // payload.new contains the updated game
      setGame(payload.new);
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

---

## ⚠️ Error Handling

The state machine returns `CommandResult<T>` which is either:

```typescript
// Success
{ success: true, data: T }

// Failure
{ success: false, error: string }
```

Examples of errors that will be caught:

- ❌ Insufficient permissions → "Insufficient permissions..."
- ❌ Invalid state transition → "Cannot transition from X to Y"
- ❌ Wrong game status → "Game is not in live status"
- ❌ Negative time value → "Time cannot be negative"

---

## 🧪 Next Steps

1. **Update your database schema** to ensure the `games` table has:

   - `status` (enum: voting, live, finished, cancelled)
   - `live_game_status` (enum: waiting_for_kickoff, in_progress, paused, halftime, waiting_for_second_half, ended)
   - `moderators` (array of user IDs)
   - `participants` (array of user IDs)

2. **Update existing game creation** to set `status: 'voting'` instead of old enums

3. **Add Realtime** to your frontend components

4. **Add move recording** if needed (extend the gameStateMachine further)

---

## 💡 Design Patterns Used

- **CQRS**: Commands return validated state changes, API routes handle persistence
- **State Machine**: Valid transitions are enforced; invalid ones return errors
- **Permission-based Access Control**: Multiple levels (global admin, global moderator, game-specific)
- **Type Safety**: Full TypeScript with Zod schemas ready
