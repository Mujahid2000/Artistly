"use client"

import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right"
  distance?: number
}

export function StaggerItem({ children, direction = "up", distance = 20, className, ...props }: StaggerItemProps) {
  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          ...directionOffset[direction],
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
