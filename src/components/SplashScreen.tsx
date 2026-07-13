import { motion, AnimatePresence } from 'framer-motion'

type SplashScreenProps = {
  isVisible: boolean
  onComplete: () => void
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
  const cardCount = 8 // Cards 0-7

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-pastel"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-48 w-96 mb-8">
            {Array.from({ length: cardCount }).map((_, index) => {
              const fanAngle = 70
              const startAngle = -fanAngle / 2
              const anglePerCard = fanAngle / (cardCount - 1)
              const rotation = startAngle + index * anglePerCard

              return (
                <motion.div
                  key={index}
                  className="absolute left-1/2 bottom-0 w-14 h-20 bg-pastel"
                  style={{
                    transformOrigin: 'bottom center',
                    border: '3px solid #1A1A1A',
                  }}
                  initial={{
                    x: '-50%',
                    y: 100,
                    rotate: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: '-50%',
                    y: 0,
                    rotate: rotation,
                    opacity: 1,
                  }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.span
                      className="font-title text-2xl text-dark"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                    >
                      {index}
                    </motion.span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.h1
            className="font-title text-6xl text-dark tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Flip 7
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
