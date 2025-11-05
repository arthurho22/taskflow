// src/components/Surface.tsx
'use client'
import React, { ReactNode } from 'react'

export default function Surface({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`surface ${className}`}>
      {children}
    </div>
  )
}
