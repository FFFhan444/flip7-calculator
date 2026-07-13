import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, Zap } from 'lucide-react'
import type { Card, ScoreboardPlayer } from '../../lib/scoreboard'
import { calculateScore, MODIFIER_CARDS, MULTIPLIER_CARDS } from '../../lib/scoreboard'

type CardSelectorTrayProps = {
  player: ScoreboardPlayer
  onSubmit: (playerId: string, cards: Card[], manualScore?: number) => void
  onCancel: () => void
}

export function CardSelectorTray({ player, onSubmit, onCancel }: CardSelectorTrayProps) {
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [isManual, setIsManual] = useState(false)
  const [manualScore, setManualScore] = useState('')

  const toggleCard = (card: Card) => {
    setSelectedCards(prev =>
      prev.includes(card) ? prev.filter(c => c !== card) : [...prev, card]
    )
  }

  const score = useMemo(() => calculateScore(selectedCards), [selectedCards])

  const numberCards = selectedCards.filter(c => typeof c === 'number')
  const numberCardCount = numberCards.length
  const uniqueNumberCount = new Set(numberCards).size
  const isFlip7 = uniqueNumberCount === 7 && numberCardCount === 7

  const canSubmit = isManual ? manualScore !== '' : selectedCards.length > 0

  const handleSubmit = () => {
    if (isManual) {
      const parsed = parseInt(manualScore, 10)
      if (!isNaN(parsed)) {
        onSubmit(player.id, [], parsed)
      }
    } else {
      onSubmit(player.id, selectedCards)
    }
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="space-y-3"
    >
      {/* Top row: player name, score preview, controls */}
      <div className="flex items-center gap-3">
        <div className="flex-grow min-w-0">
          <span className="font-semibold text-dark truncate block">{player.name}</span>
        </div>

        {/* Score preview */}
        <div className="flex items-center gap-1.5">
          {isFlip7 && !isManual && (
            <span className="flex items-center gap-1 text-dark text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              FLIP 7
            </span>
          )}
          <span className="font-bold text-dark text-xl tabular-nums">
            {isManual ? (manualScore || '0') : score}
          </span>
        </div>

        {/* Manual toggle */}
        <button
          onClick={() => setIsManual(!isManual)}
          className={`px-3 py-1.5 text-xs font-semibold border-2 border-dark transition-colors ${
            isManual ? 'bg-dark text-pastel' : 'text-dark hover:bg-dark hover:text-pastel'
          }`}
        >
          Manual
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-4 py-1.5 bg-dark text-pastel font-semibold text-sm pixel-corners-dark hover:bg-dark-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit
        </button>

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="p-1.5 text-dark-muted hover:text-dark transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Card selector or manual input */}
      {isManual ? (
        <input
          type="number"
          value={manualScore}
          onChange={(e) => setManualScore(e.target.value)}
          placeholder="Enter score..."
          autoFocus
          className="w-full px-4 py-2 border-2 border-dark bg-pastel text-dark placeholder-dark/50 focus:outline-none pixel-corners"
        />
      ) : (
        <div className="space-y-1.5">
          {/* Row 1: 12 down to 7 */}
          <div className="grid grid-cols-6 gap-1.5">
            {([12, 11, 10, 9, 8, 7] as const).map(card => (
              <CardChip
                key={card}
                label={String(card)}
                selected={selectedCards.includes(card)}
                onClick={() => toggleCard(card)}
              />
            ))}
          </div>
          {/* Row 2: 6 down to 1 */}
          <div className="grid grid-cols-6 gap-1.5">
            {([6, 5, 4, 3, 2, 1] as const).map(card => (
              <CardChip
                key={card}
                label={String(card)}
                selected={selectedCards.includes(card)}
                onClick={() => toggleCard(card)}
              />
            ))}
          </div>
          {/* Row 3: 0, modifiers, x2 — stretched to match width */}
          <div className="grid grid-cols-7 gap-1.5">
            <CardChip
              label="0"
              selected={selectedCards.includes(0)}
              onClick={() => toggleCard(0)}
            />
            {MODIFIER_CARDS.map(card => (
              <CardChip
                key={card}
                label={card}
                selected={selectedCards.includes(card)}
                onClick={() => toggleCard(card)}
              />
            ))}
            {MULTIPLIER_CARDS.map(card => (
              <CardChip
                key={card}
                label={card}
                selected={selectedCards.includes(card)}
                onClick={() => toggleCard(card)}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function CardChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 text-xs font-bold border-2 border-dark transition-colors ${
        selected
          ? 'bg-dark text-pastel'
          : 'bg-pastel-light text-dark hover:bg-dark hover:text-pastel'
      }`}
    >
      {label}
    </button>
  )
}
