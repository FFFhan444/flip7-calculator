import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SplashScreen } from './components/SplashScreen'
import { ScoreboardTable } from './components/scoreboard/ScoreboardTable'
import { CardSelectorTray } from './components/scoreboard/CardSelectorTray'
import { AddScoreboardPlayerForm } from './components/scoreboard/AddScoreboardPlayerForm'
import { useScoreboard } from './hooks/useScoreboard'
import { useVisualViewportHeight } from './hooks/useVisualViewportHeight'
import type { ScoreboardPlayer, Card } from './lib/scoreboard'
import './index.css'

function App() {
  const scoreboard = useScoreboard()
  const viewportHeight = useVisualViewportHeight()
  const [showSplash, setShowSplash] = useState(true)
  const [splashMinTimePassed, setSplashMinTimePassed] = useState(false)
  const [scoringPlayer, setScoringPlayer] = useState<ScoreboardPlayer | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashMinTimePassed(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (splashMinTimePassed) {
      setShowSplash(false)
    }
  }, [splashMinTimePassed])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [scoreboard.players.length])

  const handleScorePlayer = (player: ScoreboardPlayer) => {
    setScoringPlayer(player)
  }

  const handleDeleteScoreboardPlayer = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      scoreboard.removePlayer(playerId)
      if (scoringPlayer?.id === playerId) {
        setScoringPlayer(null)
      }
    }
  }

  const handleNewGame = () => {
    if (confirm('Start a new game? Scores will be reset but players will be kept.')) {
      scoreboard.newGame()
      setScoringPlayer(null)
    }
  }

  const handleResetAll = () => {
    if (confirm('Reset everything? All players and scores will be removed.')) {
      scoreboard.resetAll()
      setScoringPlayer(null)
    }
  }

  const handleSubmitRound = (playerId: string, cards: Card[], manualScore?: number) => {
    scoreboard.submitRound(playerId, cards, manualScore)
    setScoringPlayer(null)
  }

  return (
    <>
      <SplashScreen
        isVisible={showSplash}
        onComplete={() => {}}
      />

      <div
        className="fixed top-0 left-0 w-full h-dvh flex flex-col bg-pastel overflow-hidden"
        style={viewportHeight !== null ? { height: `${viewportHeight}px` } : undefined}
      >
        {/* Header */}
        <header className="shrink-0 max-w-2xl w-full mx-auto px-4 pt-8">
          <h1 className="font-title text-5xl text-dark">
            Flip 7
          </h1>
        </header>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <ScoreboardTable
              players={scoreboard.players}
              onScorePlayer={handleScorePlayer}
              onDeletePlayer={handleDeleteScoreboardPlayer}
              onNewGame={handleNewGame}
              onResetAll={handleResetAll}
              scoringPlayerId={scoringPlayer?.id ?? null}
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="shrink-0 bg-pastel border-t-2 border-dark">
          <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
            <AnimatePresence mode="wait">
              {scoringPlayer ? (
                <CardSelectorTray
                  key="card-selector"
                  player={scoringPlayer}
                  onSubmit={handleSubmitRound}
                  onCancel={() => setScoringPlayer(null)}
                />
              ) : (
                <AddScoreboardPlayerForm
                  key="add-player"
                  onAddPlayer={scoreboard.addPlayer}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
