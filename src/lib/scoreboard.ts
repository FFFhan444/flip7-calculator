// Card types for Flip 7 scoring
export type NumberCard = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type ModifierCard = '+2' | '+4' | '+6' | '+8' | '+10'
export type MultiplierCard = 'x2'
export type Card = NumberCard | ModifierCard | MultiplierCard

export type RoundScore = {
  roundNumber: number
  cards: Card[]
  calculatedScore: number
  manualOverride?: number
}

export type ScoreboardPlayer = {
  id: string
  name: string
  totalScore: number
  rounds: RoundScore[]
}

const MODIFIER_VALUES: Record<string, number> = {
  '+2': 2, '+4': 4, '+6': 6, '+8': 8, '+10': 10,
}

export function calculateScore(cards: Card[]): number {
  const numberCards = cards.filter((c): c is NumberCard => typeof c === 'number')
  const hasMultiplier = cards.includes('x2')

  let numberSum = numberCards.reduce<number>((sum, n) => sum + n, 0)
  if (hasMultiplier) numberSum *= 2

  const modifierSum = cards
    .filter((c): c is ModifierCard => typeof c === 'string' && c.startsWith('+'))
    .reduce((sum, m) => sum + MODIFIER_VALUES[m], 0)

  let total = numberSum + modifierSum

  // Flip 7 bonus: +15 if exactly 7 unique number cards
  const uniqueNumbers = new Set(numberCards)
  if (uniqueNumbers.size === 7 && numberCards.length === 7) {
    total += 15
  }

  return total
}

export const NUMBER_CARDS: NumberCard[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export const MODIFIER_CARDS: ModifierCard[] = ['+2', '+4', '+6', '+8', '+10']
export const MULTIPLIER_CARDS: MultiplierCard[] = ['x2']
export const ALL_CARDS: Card[] = [...NUMBER_CARDS, ...MODIFIER_CARDS, ...MULTIPLIER_CARDS]
