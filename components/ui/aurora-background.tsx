"use client"

import type React from "react"

export const AuroraBackground = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`h-full w-full bg-white dark:bg-black relative flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-blur-1 absolute -inset-[10px] opacity-50" />
        <div className="aurora-blur-2 absolute -inset-[10px] opacity-50" />
        <div className="aurora-blur-3 absolute -inset-[10px] opacity-50" />
      </div>
      {children}
    </div>
  )
}
