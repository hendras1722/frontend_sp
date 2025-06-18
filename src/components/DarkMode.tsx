// app/components/ThemeSwitcher.tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'
import { Else, If } from './if'
import { useToggle } from '@msa_cli/react-composable'

export default function DarkMode() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useToggle(false)

  useEffect(() => {
    setMounted()
  }, [])

  function handleMode() {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  if (!mounted) return null

  return (
    <span>
      <If condition={theme === 'light'}>
        <button onClick={() => handleMode()}>
          <FaSun />
        </button>
        <Else>
          <button onClick={() => handleMode()}>
            <FaMoon />
          </button>
        </Else>
      </If>
    </span>
  )
}
