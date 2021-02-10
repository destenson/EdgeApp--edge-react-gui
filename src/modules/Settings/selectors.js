// @flow

import type { EdgeCurrencyInfo, EdgeDenomination } from 'edge-core-js'

import { type CurrencySetting } from '../../reducers/scenes/SettingsReducer.js'
import { type RootState } from '../../types/reduxTypes.js'
import isoFiatDenominations from './ISOFiatDenominations'

export const emptyEdgeDenomination: EdgeDenomination = {
  name: '',
  multiplier: '1',
  symbol: ''
}

export const getSettings = (state: RootState) => {
  const settings = state.ui.settings
  return settings
}

export const getIsTouchIdSupported = (state: RootState) => {
  const settings = getSettings(state)
  return settings.isTouchSupported
}
export const getIsTouchIdEnabled = (state: RootState) => {
  const settings = getSettings(state)
  return settings.isTouchEnabled
}

export const getLoginStatus = (state: RootState): boolean | null => {
  const settings = getSettings(state)
  const loginStatus = settings.loginStatus
  return loginStatus
}

export const getCurrencySettings = (state: RootState, currencyCode: string): CurrencySetting => {
  const settings = getSettings(state)
  const currencySettings = settings[currencyCode.toUpperCase()] || isoFiatDenominations[currencyCode.toUpperCase()]
  return currencySettings
}

export const getCryptocurrencySettings = (state: RootState, currencyCode: string) => {
  const settings = getSettings(state)
  const currencySettings = settings[currencyCode.toUpperCase()]
  return currencySettings
}

export const getMultiplierFromSettings = (state: RootState, currencyCode: string) => {
  const settings = getSettings(state)
  return settings[currencyCode.toUpperCase()].denomination
}

export const getDenominations = (state: RootState, currencyCode: string): EdgeDenomination[] => {
  const currencySettings = getCurrencySettings(state, currencyCode)
  if (currencySettings == null || currencySettings.denominations == null)
    return [
      {
        name: '',
        multiplier: getMultiplierFromSettings(state, currencyCode),
        symbol: ''
      }
    ]
  const denominations = currencySettings.denominations
  return denominations
}

export const getDisplayDenominationKey = (state: RootState, currencyCode: string) => {
  const settings = getSettings(state)
  const currencySettings = settings[currencyCode.toUpperCase()]
  const selectedDenominationKey = currencySettings ? currencySettings.denomination : '1'
  return selectedDenominationKey
}

export const getDisplayDenominationFromSettings = (settings: any, currencyCode: string): EdgeDenomination => {
  const currencySettings = settings[currencyCode] || isoFiatDenominations[currencyCode]
  const selectedDenominationKey = currencySettings.denomination
  const denominations = currencySettings.denominations
  let selectedDenomination: EdgeDenomination = emptyEdgeDenomination
  for (const d of denominations) {
    if (d.multiplier === selectedDenominationKey) {
      selectedDenomination = d
    }
  }
  return selectedDenomination
}

export const getDisplayDenominationFull = (state: RootState, currencyCode: string): EdgeDenomination => {
  const settings = state.ui.settings
  const currencySettings = settings[currencyCode]
  const selectedDenominationKey = currencySettings.denomination
  const denominations = currencySettings.denominations
  let selectedDenomination: EdgeDenomination = emptyEdgeDenomination
  for (const d of denominations) {
    if (d.multiplier === selectedDenominationKey) {
      selectedDenomination = d
    }
  }
  return selectedDenomination
}

export const getDisplayDenomination = (state: RootState, currencyCode: string): EdgeDenomination => {
  const selectedDenominationKey = getDisplayDenominationKey(state, currencyCode)
  const denominations = getDenominations(state, currencyCode)
  let selectedDenomination: EdgeDenomination = emptyEdgeDenomination
  for (const d of denominations) {
    if (d.multiplier === selectedDenominationKey) {
      selectedDenomination = d
    }
  }
  return selectedDenomination
}

export const getExchangeDenomination = (state: RootState, currencyCode: string) => {
  const denominations = getDenominations(state, currencyCode)
  let exchangeDenomination: EdgeDenomination = emptyEdgeDenomination
  for (const d of denominations) {
    if (d.name === currencyCode) {
      exchangeDenomination = d
    }
  }
  return exchangeDenomination
}

export const getCustomTokens = (state: RootState) => {
  const settings = getSettings(state)
  return settings.customTokens
}

export const getPlugins = (state: RootState) => {
  const settings = getSettings(state)
  const plugins = settings.plugins
  return plugins
}

export const getPluginInfo = (state: RootState, type: string): EdgeCurrencyInfo => {
  const plugins = getPlugins(state)
  const currencyInfo: EdgeCurrencyInfo = plugins[type.toLowerCase()]
  return currencyInfo
}

export const getSettingsLock = (state: RootState) => {
  const settings = getSettings(state)
  return settings.changesLocked
}
export const getAutoLogoutTimeInSeconds = (state: RootState): number => {
  const settings = getSettings(state)
  return settings.autoLogoutTimeInSeconds
}

export const getDefaultFiat = (state: RootState) => {
  const settings = getSettings(state)
  const defaultIsoFiat: string = settings.defaultIsoFiat
  const defaultFiat = defaultIsoFiat.replace('iso:', '')
  return defaultFiat
}

export const getDefaultIsoFiat = (state: RootState) => {
  const settings = getSettings(state)
  const defaultIsoFiat: string = settings.defaultIsoFiat
  return defaultIsoFiat
}

export const getPinLoginEnabled = (state: RootState) => {
  const settings = getSettings(state)
  const pinLoginEnabled = settings.pinLoginEnabled
  return pinLoginEnabled
}

export const getIsAccountBalanceVisible = (state: RootState) => {
  const settings = getSettings(state)
  return settings.isAccountBalanceVisible
}
