"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { ComponentProps } from "react"
import { forwardRef } from "react"

interface AnimatedCardProps extends ComponentProps<typeof Card> {
  hoverScale?: number
  tapScale?: number
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, hoverScale = 1.02, tapScale = 0.98, className, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: hoverScale, y: -2 }}
        whileTap={{ scale: tapScale }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="cursor-pointer"
      >
        <Card ref={ref} className={className} {...props}>
          {children}
        </Card>
      </motion.div>
    )
  },
)

AnimatedCard.displayName = "AnimatedCard"
