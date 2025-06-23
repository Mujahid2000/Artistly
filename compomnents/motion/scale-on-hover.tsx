"use client"

import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

interface ScaleOnHoverProps extends HTMLMotionProps<"div"> {
  scale?: number
  duration?: number
}

export function ScaleOnHover({ children, scale = 1.05, duration = 0.2, className, ...props }: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ duration, ease: "easeInOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
