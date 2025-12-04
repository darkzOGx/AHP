import { createTamagui, createTokens } from '@tamagui/core'

// Brand colors matching the Figma light-gray palette
const brandColors = {
  gray100: '#D3D3D3',
  gray200: '#878787',
  gray300: '#5E5E5E',
  gray400: '#363636',
}

const tokens = createTokens({
  color: {
    // Base colors
    white: '#FFFFFF',
    black: '#000000',

    // Brand colors
    brandGray100: brandColors.gray100,
    brandGray200: brandColors.gray200,
    brandGray300: brandColors.gray300,
    brandGray400: brandColors.gray400,

    // Light theme colors
    lightBackground: '#FFFFFF',
    lightForeground: brandColors.gray400,
    lightBorder: brandColors.gray100,
    lightMuted: brandColors.gray100,
    lightAccent: brandColors.gray300,

    // Dark theme colors
    darkBackground: brandColors.gray400,
    darkForeground: brandColors.gray100,
    darkBorder: brandColors.gray300,
    darkMuted: brandColors.gray300,
    darkAccent: brandColors.gray200,
  },
  size: {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    7: 35,
    8: 40,
    9: 45,
    10: 50,
    true: 20,
  },
  space: {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    7: 35,
    8: 40,
    9: 45,
    10: 50,
    true: 20,
  },
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 7,
    4: 9,
    5: 12,
    6: 15,
    7: 18,
    8: 21,
    9: 24,
    true: 9,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
})

export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: {
      background: tokens.color.lightBackground,
      foreground: tokens.color.lightForeground,
      border: tokens.color.lightBorder,
      muted: tokens.color.lightMuted,
      accent: tokens.color.lightAccent,
      brandGray100: brandColors.gray100,
      brandGray200: brandColors.gray200,
      brandGray300: brandColors.gray300,
      brandGray400: brandColors.gray400,
    },
    dark: {
      background: tokens.color.darkBackground,
      foreground: tokens.color.darkForeground,
      border: tokens.color.darkBorder,
      muted: tokens.color.darkMuted,
      accent: tokens.color.darkAccent,
      brandGray100: brandColors.gray100,
      brandGray200: brandColors.gray200,
      brandGray300: brandColors.gray300,
      brandGray400: brandColors.gray400,
    },
  },
})

export type AppConfig = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
