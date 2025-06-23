"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { forwardRef, ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, loading, disabled, className, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <Button ref={ref} disabled={disabled || loading} className={className} {...props}>
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            />
          ) : null}
          {children}
        </Button>
      </motion.div>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"
