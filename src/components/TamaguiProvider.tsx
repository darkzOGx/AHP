'use client'

import { TamaguiProvider as TamaguiProviderBase } from '@tamagui/core'
import tamaguiConfig from '../../tamagui.config'
import { ReactNode } from 'react'

export function TamaguiProvider({ children }: { children: ReactNode }) {
  return (
    <TamaguiProviderBase config={tamaguiConfig} defaultTheme="dark">
      {children}
    </TamaguiProviderBase>
  )
}
