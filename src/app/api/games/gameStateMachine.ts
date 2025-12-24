import { GAME_STATUS, VALID_GAME_STATUS_TRANSITIONS } from "@/config";
import { USER_ROLE } from "@/store/auth";
import { IGame } from "@/app/[locale]/(authenticated)/games/types";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type CommandResult<
  T extends Partial<IGame> | MoveData | void = Partial<IGame>,
> = { success: true; data: T } | { success: false; error: string };

export interface GameModeratorContext {
  userId: string;
  userRole: USER_ROLE;
  gameId: string;
  game: IGame;
}

export interface MoveData {
  scorer_id: string;
  is_scorer_goalkeeper: boolean;
  assist_id: string | null;
  is_assist_goalkeeper: boolean;
  time: string; // ISO timestamp
}

// ============================================================================
// GAME STATE MACHINE CLASS
// ============================================================================

export class GameStateMachine {
  private game: IGame;
  private userId: string;
  private userRole: USER_ROLE;

  constructor(game: IGame, userId: string, userRole: USER_ROLE) {
    this.game = game;
    this.userId = userId;
    this.userRole = userRole;
  }

  // ========================================================================
  // PERMISSION CHECKS
  // ========================================================================

  private canModifyLiveStatus(): boolean {
    // Admins always have access
    if (this.userRole === USER_ROLE.admin) return true;

    // Global moderators have access
    if (this.userRole === USER_ROLE.moderator) return true;

    // Game-specific moderators have access
    if (
      Array.isArray(this.game.moderators) &&
      this.game.moderators.some((m) => m.value === this.userId)
    ) {
      return true;
    }

    return false;
  }

  private ensureGameLive(): CommandResult<void> {
    if (this.game.status !== GAME_STATUS.live) {
      return {
        success: false,
        error: "Game is not in live status",
      };
    }
    return { success: true, data: undefined };
  }

  private ensureValidStateTransition(
    nextState: GAME_STATUS
  ): CommandResult<void> {
    const currentState = this.game.status;
    if (!currentState) {
      return {
        success: false,
        error: "Live game status not initialized",
      };
    }

    const validTransitions = VALID_GAME_STATUS_TRANSITIONS[currentState];
    if (!validTransitions.includes(nextState)) {
      return {
        success: false,
        error: `Cannot transition from ${currentState} to ${nextState}`,
      };
    }
    return { success: true, data: undefined };
  }

  // ========================================================================
  // PUBLIC COMMANDS
  // ========================================================================

  /**
   * Publish game for voting (initialization → voting)
   */
  publishForVoting(): CommandResult<Partial<IGame>> {
    if (!this.canModifyLiveStatus()) {
      return {
        success: false,
        error: "Insufficient permissions to publish game",
      };
    }

    if (this.game.status !== GAME_STATUS.initialization) {
      return {
        success: false,
        error: "Game must be in initialization status to publish for voting",
      };
    }

    return {
      success: true,
      data: {
        status: GAME_STATUS.voting,
      },
    };
  }

  /**
   * Confirm game after voting (voting → confirmed)
   */
  confirmGame(): CommandResult<Partial<IGame>> {
    if (!this.canModifyLiveStatus()) {
      return {
        success: false,
        error: "Insufficient permissions to confirm game",
      };
    }

    if (this.game.status !== GAME_STATUS.voting) {
      return {
        success: false,
        error: "Game must be in voting status to confirm",
      };
    }

    return {
      success: true,
      data: {
        status: GAME_STATUS.confirmed,
      },
    };
  }

  /**
   * Start a game (confirmed → live)
   * Game goes directly to in_progress, skipping kickoff
   */
  startGame(): CommandResult<Partial<IGame>> {
    if (!this.canModifyLiveStatus()) {
      return {
        success: false,
        error: "Insufficient permissions to start game",
      };
    }

    if (this.game.status !== GAME_STATUS.confirmed) {
      return {
        success: false,
        error: "Game must be in confirmed status to start",
      };
    }

    return {
      success: true,
      data: {
        status: GAME_STATUS.live,
        started_at: new Date().toISOString(),
      },
    };
  }

  /**
   * End the match (in_progress/paused → ended)
   * Note: After ending, moderator must call finishGame() to move to finished status
   */
  endGame(): CommandResult<Partial<IGame>> {
    if (!this.canModifyLiveStatus()) {
      return { success: false, error: "Insufficient permissions" };
    }

    const gameCheck = this.ensureGameLive();
    if (!gameCheck.success) return gameCheck;

    const transitionCheck = this.ensureValidStateTransition(
      GAME_STATUS.completed
    );
    if (!transitionCheck.success) return transitionCheck;

    return {
      success: true,
      data: {
        status: GAME_STATUS.completed,
      },
    };
  }

  /**
   * Finish game (transition from live → finished)
   * Should be called after endGame() or separately
   */
  finishGame(): CommandResult<Partial<IGame>> {
    if (!this.canModifyLiveStatus()) {
      return { success: false, error: "Insufficient permissions" };
    }

    if (this.game.status !== GAME_STATUS.live) {
      return {
        success: false,
        error: "Game must be in live status",
      };
    }

    return {
      success: true,
      data: {
        status: GAME_STATUS.completed,
        ended_at: new Date().toISOString(),
      },
    };
  }

  /**
   * Cancel the game (scheduled → cancelled or live → cancelled)
   */
  cancelGame(reason?: string): CommandResult<Partial<IGame>> {
    if (!this.canModifyLiveStatus()) {
      return { success: false, error: "Insufficient permissions" };
    }

    if (
      this.game.status !== GAME_STATUS.cancelled &&
      this.game.status !== GAME_STATUS.live
    ) {
      return {
        success: false,
        error: "Cannot cancel a game that is already finished or cancelled",
      };
    }

    return {
      success: true,
      data: {
        status: GAME_STATUS.cancelled,
        cancelled_reason: reason || null,
      },
    };
  }

  /**
   * Record a move/goal (only valid when game is in progress)
   */
  recordMove(moveData: MoveData): CommandResult<MoveData> {
    if (!this.canModifyLiveStatus()) {
      return { success: false, error: "Insufficient permissions" };
    }

    const gameCheck = this.ensureGameLive();
    if (!gameCheck.success) return gameCheck;

    if (this.game.status !== GAME_STATUS.live) {
      return {
        success: false,
        error: `Cannot record move when game is ${this.game.status}`,
      };
    }

    // Basic validation
    if (!moveData.scorer_id) {
      return { success: false, error: "Scorer ID is required" };
    }
    if (!moveData.time) {
      return { success: false, error: "Time is required" };
    }

    return {
      success: true,
      data: moveData,
    };
  }

  /**
   * Get current game state for verification
   */
  getGameState(): IGame {
    return this.game;
  }

  /**
   * Check if user can perform live status modifications
   */
  hasModeratorAccess(): boolean {
    return this.canModifyLiveStatus();
  }
}
