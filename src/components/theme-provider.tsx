'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/react'
import dynamic from 'next/dynamic'
import { type ThemeProviderProps as BaseThemeProviderProps } from 'next-themes'

type ThemeProviderProps = Readonly<BaseThemeProviderProps>
const NextThemesProvider = dynamic(
  () => import('next-themes').then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
)

export function ThemeProvider({
  children,
  ...props
}: Readonly<ThemeProviderProps>) {
  return (
    <NextUIProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </NextUIProvider>
  )
}
