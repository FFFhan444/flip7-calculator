import { useState, useEffect, useCallback } from 'react'
import type { Card, ScoreboardPlayer, RoundScore } from '../lib/scoreboard'
import { calculateScore } from '../lib/scoreboard'

const STORAGE_KEY = 'flip7-scoreboard'

function getStored(): ScoreboardPlayer[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function persist(players: ScoreboardPlayer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
}

function sorted(players: ScoreboardPlayer[]): ScoreboardPlayer[] {
  return [...players].sort((a, b) => b.totalScore - a.totalScore)
}

export function useScoreboard() {
  const [players, setPlayers] = useState<ScoreboardPlayer[]>([])

  useEffect(() => {
    setPlayers(sorted(getStored()))
  }, [])

  const save = useCallback((updated: ScoreboardPlayer[]) => {
    const s = sorted(updated)
    persist(s)
    setPlayers(s)
  }, [])

  const addPlayer = useCallback((name: string): { success: boolean; error?: string } => {
    const trimmed = name.trim()
    if (!trimmed) return { success: false, error: 'Name cannot be empty' }

    const current = getStored()
    if (current.find(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, error: 'A player with this name already exists' }
    }

    const newPlayer: ScoreboardPlayer = {
      id: crypto.randomUUID(),
      name: trimmed,
      totalScore: 0,
      rounds: [],
    }
    save([...current, newPlayer])
    return { success: true }
  }, [save])

  const removePlayer = useCallback((playerId: string) => {
    save(getStored().filter(p => p.id !== playerId))
  }, [save])

  const submitRound = useCallback((playerId: string, cards: Card[], manualScore?: number) => {
    const current = getStored()
    const player = current.find(p => p.id === playerId)
    if (!player) return

    const calculatedScore = calculateScore(cards)
    const score = manualScore ?? calculatedScore

    const round: RoundScore = {
      roundNumber: player.rounds.length + 1,
      cards,
      calculatedScore,
      manualOverride: manualScore,
    }

    player.rounds.push(round)
    player.totalScore += score
    save(current)
  }, [save])

  const editRoundScore = useCallback((playerId: string, roundNumber: number, newScore: number) => {
    const current = getStored()
    const player = current.find(p => p.id === playerId)
    if (!player) return

    const round = player.rounds.find(r => r.roundNumber === roundNumber)
    if (!round) return

    const oldScore = round.manualOverride ?? round.calculatedScore
    round.manualOverride = newScore
    player.totalScore += newScore - oldScore
    save(current)
  }, [save])

  const newGame = useCallback(() => {
    const current = getStored()
    const reset = current.map(p => ({ ...p, totalScore: 0, rounds: [] }))
    save(reset)
  }, [save])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setPlayers([])
  }, [])

  return {
    players,
    addPlayer,
    removePlayer,
    submitRound,
    editRoundScore,
    newGame,
    resetAll,
  }
}
