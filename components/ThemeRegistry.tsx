'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { ReactNode } from 'react'

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  )
} 