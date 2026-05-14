"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extender ButtonProps para incluir props de motion
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'premium' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'xl';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95"
    
    const variants = {
      default: "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500",
      outline: "border-2 border-slate-700 bg-transparent hover:border-cyan-500/50 hover:bg-slate-900/50 text-white",
      secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-white/5",
      ghost: "hover:bg-slate-900/50 hover:text-cyan-400 text-slate-400",
      premium: "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-600 border border-white/10",
      glow: "bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:bg-cyan-400",
    }
    
    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 rounded-xl px-4 text-xs",
      lg: "h-14 rounded-[1.25rem] px-10 text-base",
      xl: "h-16 rounded-3xl px-12 text-lg font-black uppercase tracking-wider",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
