"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'glow' | 'accent';
  hover?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function Card({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  onClick
}: CardProps) {
  const baseStyles = "relative overflow-hidden rounded-[2rem] border transition-all duration-500"
  
  const variants = {
    default: "bg-slate-900/50 border-white/10",
    glass: "bg-slate-950/40 backdrop-blur-xl border-white/10",
    glow: "bg-slate-900/50 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]",
    accent: "bg-gradient-to-br from-slate-900 to-slate-950 border-cyan-500/30",
  }

  const hoverStyles = hover ? "hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:-translate-y-1" : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
    >
      {/* Subtle Inner Highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6 pb-2", className)}>{children}</div>
}

export function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6 pt-2", className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6 pt-0 flex items-center", className)}>{children}</div>
}
