import { motion } from 'framer-motion'
import { Trash2, Crown, RotateCcw, Bomb, Target } from 'lucide-react'
import type { ScoreboardPlayer } from '../../lib/scoreboard'

type ScoreboardTableProps = {
  players: ScoreboardPlayer[]
  onScorePlayer: (player: ScoreboardPlayer) => void
  onDeletePlayer: (playerId: string) => void
  onNewGame: () => void
  onResetAll: () => void
  scoringPlayerId: string | null
}

export function ScoreboardTable({
  players,
  onScorePlayer,
  onDeletePlayer,
  onNewGame,
  onResetAll,
  scoringPlayerId,
}: ScoreboardTableProps) {
  return (
    <div>
      {/* Action buttons */}
      {players.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={onNewGame}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dark text-dark font-semibold text-sm hover:bg-dark hover:text-pastel transition-colors pixel-corners"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
          <button
            onClick={onResetAll}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dark text-dark-muted font-semibold text-sm hover:bg-dark hover:text-pastel transition-colors pixel-corners"
          >
            <Bomb className="w-4 h-4" />
            Reset All
          </button>
        </div>
      )}

      {/* Empty state */}
      {players.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-muted text-lg">No players yet. Add someone to get started!</p>
        </div>
      )}

      {/* Player rows */}
      <div className="space-y-3">
        {players.map((player, index) => {
          const isLeader = index === 0 && player.totalScore > 0
          const isScoring = scoringPlayerId === player.id

          return (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-pastel p-4 pixel-corners relative ${
                isLeader ? 'ring-2 ring-dark scale-[1.02] z-10' : ''
              } ${isScoring ? 'ring-2 ring-dark-muted' : ''}`}
            >
              <div className="flex items-center gap-3 relative z-10">
                {/* Position */}
                <div className={`w-8 h-8 border-2 border-dark flex items-center justify-center flex-shrink-0 ${isLeader ? 'bg-dark' : ''}`}>
                  {isLeader ? (
                    <Crown className="w-5 h-5 text-pastel" />
                  ) : (
                    <span className="font-title text-dark text-sm">{index + 1}</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-grow min-w-0">
                  <h3 className={`font-semibold text-dark truncate ${isLeader ? 'text-xl' : 'text-lg'}`}>
                    {player.name}
                  </h3>
                  {player.rounds.length > 0 && (
                    <p className="text-dark-muted text-xs">
                      {player.rounds.length} round{player.rounds.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Total Score */}
                <div className="flex items-center gap-1.5 text-dark">
                  <span className={`font-bold ${isLeader ? 'text-2xl' : 'text-xl'}`}>
                    {player.totalScore}
                  </span>
                </div>

                {/* Score Round button */}
                <button
                  onClick={() => onScorePlayer(player)}
                  className="w-10 h-10 bg-dark text-pastel flex items-center justify-center hover:bg-dark-soft transition-colors pixel-corners-dark"
                  title="Score round"
                >
                  <Target className="w-5 h-5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeletePlayer(player.id)}
                  className="p-2 text-dark-muted hover:text-dark transition-colors"
                  title="Delete player"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
