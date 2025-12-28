"use server";

import { NextResponse } from "next/server";
import {
  GameStateMachine,
  CommandResult,
  MoveData,
} from "../../gameStateMachine";
import { createClient } from "@/utils/supabase/server";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { USER_ROLE } from "@/store/auth";
import { IGame } from "@/app/[locale]/(authenticated)/games/types";

/**
 * Example POST endpoint for executing game state commands
 *
 * Supported commands:
 * - publishForVoting: initialization → voting
 * - confirmGame: voting → confirmed
 * - startGame: confirmed → live + in_progress
 * - pauseGame: in_progress → paused
 * - resumeGame: paused → in_progress
 * - endGame: in_progress/paused → ended
 * - finishGame: live → completed
 * - cancelGame: voting/live → cancelled
 * - recordMove: record goal/move during in_progress
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: gameId } = await params;

  // =========================================================================
  // AUTHENTICATION & AUTHORIZATION
  // =========================================================================

  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.player, // Minimum role to execute commands
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  // =========================================================================
  // REQUEST PARSING
  // =========================================================================

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { command, payload } = body;

  if (!command || typeof command !== "string") {
    return NextResponse.json({ error: "Command is required" }, { status: 400 });
  }

  // =========================================================================
  // FETCH GAME DATA
  // =========================================================================

  const supabase = await createClient();

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    console.error("Game fetch error:", gameError);
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  // Enrich moderators and participants with full data
  const enrichedGame: IGame = game;

  if (Array.isArray(game.moderators) && game.moderators.length > 0) {
    const { data: moderators } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role")
      .in("id", game.moderators);

    if (moderators) {
      enrichedGame.moderators = moderators.map((m) => ({
        label: `${m.first_name || "---"} ${m.last_name || "---"}`,
        value: m.id,
        role: m.role,
      }));
    }
  }

  // =========================================================================
  // INITIALIZE STATE MACHINE & EXECUTE COMMAND
  // =========================================================================

  const stateMachine = new GameStateMachine(enrichedGame, user_id, role);
  let result: CommandResult<Partial<IGame> | MoveData>;

  switch (command) {
    case "publishForVoting":
      result = stateMachine.publishForVoting();
      break;

    case "confirmGame":
      result = stateMachine.confirmGame();
      break;

    case "startGame":
      result = stateMachine.startGame();
      break;

    // case "kickoff":
    //   result = stateMachine.kickoff();
    //   break;

    // case "pauseGame":
    //   result = stateMachine.pauseGame();
    //   break;

    // case "resumeGame":
    //   result = stateMachine.resumeGame();
    //   break;

    case "endGame":
      result = stateMachine.endGame();
      break;

    case "finishGame":
      result = stateMachine.finishGame();
      break;

    case "cancelGame":
      result = stateMachine.cancelGame(payload?.reason);
      break;

    case "recordMove":
      result = stateMachine.recordMove(payload);
      // If recordMove validation passes, insert goal into goals table
      if (result.success) {
        const { error: goalError } = await supabase
          .from("goals")
          .insert([
            {
              game_id: gameId,
              scorer_id: payload.scorer_id,
              is_scorer_goalkeeper: payload.is_scorer_goalkeeper,
              assist_id: payload.assist_id || null,
              is_assist_goalkeeper: payload.is_assist_goalkeeper || false,
              time: payload.time,
              type: payload.type,
              assist_type: payload.assist_type,
              created_by: user_id,
            },
          ])
          .select()
          .single();

        if (goalError) {
          console.error("Goal insertion error:", goalError);
          return NextResponse.json(
            { error: "Failed to record goal" },
            { status: 500 }
          );
        }
      }
      break;

    default:
      return NextResponse.json(
        { error: `Unknown command: ${command}` },
        { status: 400 }
      );
  }

  // =========================================================================
  // HANDLE COMMAND RESULT
  // =========================================================================

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  // =========================================================================
  // PERSIST CHANGES TO DATABASE
  // =========================================================================

  // Skip game update for recordMove (already inserted into goals table)
  let updatedGame: IGame | null = null;

  if (command !== "recordMove") {
    const updateData = result.data;

    const { data: gameData, error: updateError } = await supabase
      .from("games")
      .update(updateData)
      .eq("id", gameId)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update game" },
        { status: 500 }
      );
    }
    updatedGame = gameData;
  } else {
    // For recordMove, fetch current game state
    const { data: gameData } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();
    updatedGame = gameData;
  }

  // =========================================================================
  // BROADCAST TO OTHER MODERATORS (via Supabase Realtime)
  // =========================================================================
  // When Supabase Realtime is enabled, the database update will automatically
  // trigger a notification to all connected clients listening to this game.
  // Example frontend code:
  //
  // const channel = supabase
  //   .channel(`game:${gameId}`)
  //   .on(
  //     'postgres_changes',
  //     { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` },
  //     (payload) => {
  //       setGame(payload.new);
  //     }
  //   )
  //   .subscribe();

  return NextResponse.json(
    {
      success: true,
      command,
      game: updatedGame,
    },
    { status: 200 }
  );
}
