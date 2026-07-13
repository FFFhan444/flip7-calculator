import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Check, AlertCircle } from 'lucide-react'

type AddScoreboardPlayerFormProps = {
  onAddPlayer: (name: string) => { success: boolean; error?: string }
}

export function AddScoreboardPlayerForm({ onAddPlayer }: AddScoreboardPlayerFormProps) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const result = onAddPlayer(name)

    if (result.success) {
      setStatus('success')
      setName('')
      setTimeout(() => setStatus('idle'), 1500)
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Failed to add player')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player name..."
            className="w-full px-4 py-3 border-2 border-dark bg-pastel text-dark placeholder-dark/50 focus:outline-none transition-colors pixel-corners"
          />
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Check className="w-6 h-6 text-dark" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          disabled={!name.trim()}
          onMouseDown={(e) => e.preventDefault()}
          className="px-6 py-3 bg-dark text-pastel font-semibold flex items-center gap-2 hover:bg-dark-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed pixel-corners-dark"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="w-5 h-5" />
          Add
        </motion.button>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center gap-2 text-dark"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
