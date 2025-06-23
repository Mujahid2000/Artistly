"use client"

import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

interface SlideInProps extends HTMLMotionProps<"div"> {
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  duration?: number
  distance?: number
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  duration = 0.6,
  distance = 100,
  className,
  ...props
}: SlideInProps) {
  const directionOffset = {
    left: { x: -distance },
    right: { x: distance },
    up: { y: -distance },
    down: { y: distance },
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
