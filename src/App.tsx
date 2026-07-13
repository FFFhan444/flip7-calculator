import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SplashScreen } from './components/SplashScreen'
import { ScoreboardTable } from './components/scoreboard/ScoreboardTable'
import { CardSelectorTray } from './components/scoreboard/CardSelectorTray'
import { AddScoreboardPlayerForm } from './components/scoreboard/AddScoreboardPlayerForm'
import { useScoreboard } from './hooks/useScoreboard'
import type { ScoreboardPlayer, Card } from './lib/scoreboard'
import './index.css'

function App() {
  const scoreboard = useScoreboard()
  const [showSplash, setShowSplash] = useState(true)
  const [splashMinTimePassed, setSplashMinTimePassed] = useState(false)
  const [scoringPlayer, setScoringPlayer] = useState<ScoreboardPlayer | null>(null)

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

      <div className="min-h-screen bg-pastel pb-48">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <h1 className="font-title text-5xl text-dark">
              Flip 7
            </h1>
          </header>

          {/* Content */}
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

      {/* Sticky Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-pastel border-t-2 border-dark">
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
    </>
  )
}

export default App
