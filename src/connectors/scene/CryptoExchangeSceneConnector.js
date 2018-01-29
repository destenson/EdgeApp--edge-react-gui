// @flow

import type {Dispatch, State} from '../../modules/ReduxTypes'
import {connect} from 'react-redux'
import {
  CryptoExchangeSceneComponent,
  type CryptoExchangeSceneComponentStateProps,
  type CryptoExchangeSceneComponentDispatchProps
} from '../../modules/UI/scenes/CryptoExchange/CryptoExchangeSceneComponent'
import * as actions from '../../actions/indexActions'
import * as Constants from '../../constants/indexConstants'
import { getDenomFromIsoCode } from '../../modules/utils'
import { getExchangeRate } from '../../modules/Core/selectors.js'
import s from '../../locales/strings.js'
import { bns } from 'biggystring'
import { emptyCurrencyInfo, emptyGuiWallet, type GuiCurrencyInfo } from '../../types.js'
import type { SetNativeAmountInfo } from '../../actions/CryptoExchangeActions'

const DIVIDE_PRECISION = 18

export const mapStateToProps = (state: State): CryptoExchangeSceneComponentStateProps => {
  const fromWallet = state.cryptoExchange.fromWallet
  const toWallet = state.cryptoExchange.toWallet

  let exchangeRate = 1
  let fromCurrencyCode,
    fromPrimaryInfo: GuiCurrencyInfo,
    fromSecondaryInfo: GuiCurrencyInfo,
    fromButtonText: string,
    fromNativeAmount: string,
    fromExchangeAmount: string,
    fromFiatToCrypto: number
  if (fromWallet) {
    fromCurrencyCode = state.cryptoExchange.fromWalletPrimaryInfo.displayDenomination.name
    fromPrimaryInfo = state.cryptoExchange.fromWalletPrimaryInfo
    fromSecondaryInfo = {
      displayCurrencyCode: fromWallet.fiatCurrencyCode,
      exchangeCurrencyCode: fromWallet.isoFiatCurrencyCode,
      displayDenomination: getDenomFromIsoCode(fromWallet.fiatCurrencyCode),
      exchangeDenomination: getDenomFromIsoCode(fromWallet.fiatCurrencyCode)
    }
    fromNativeAmount = state.cryptoExchange.fromNativeAmount
    fromButtonText = fromWallet.name + ':' + fromCurrencyCode
    fromExchangeAmount = bns.div(fromNativeAmount, fromPrimaryInfo.exchangeDenomination.multiplier, DIVIDE_PRECISION)
    fromFiatToCrypto = getExchangeRate(
      state,
      fromPrimaryInfo.exchangeCurrencyCode,
      fromSecondaryInfo.exchangeCurrencyCode
    )
  } else {
    fromCurrencyCode = ''
    fromExchangeAmount = ''
    fromPrimaryInfo = emptyCurrencyInfo
    fromSecondaryInfo = emptyCurrencyInfo
    fromNativeAmount = ''
    fromButtonText = s.strings.select_src_wallet
    fromFiatToCrypto = 1
  }

  let toCurrencyCode,
    toPrimaryInfo: GuiCurrencyInfo,
    toSecondaryInfo: GuiCurrencyInfo,
    toButtonText: string,
    toNativeAmount: string,
    toExchangeAmount: string,
    toFiatToCrypto: number
  if (toWallet) {
    toCurrencyCode = state.cryptoExchange.toWalletPrimaryInfo.displayDenomination.name
    toPrimaryInfo = state.cryptoExchange.toWalletPrimaryInfo
    toSecondaryInfo = {
      displayCurrencyCode: toWallet.fiatCurrencyCode,
      exchangeCurrencyCode: toWallet.isoFiatCurrencyCode,
      displayDenomination: getDenomFromIsoCode(toWallet.fiatCurrencyCode),
      exchangeDenomination: getDenomFromIsoCode(toWallet.fiatCurrencyCode)
    }
    toNativeAmount = state.cryptoExchange.toNativeAmount
    toButtonText = toWallet.name + ':' + toCurrencyCode
    toExchangeAmount = bns.div(toNativeAmount, toPrimaryInfo.exchangeDenomination.multiplier, DIVIDE_PRECISION)
    toFiatToCrypto = getExchangeRate(
      state,
      toPrimaryInfo.exchangeCurrencyCode,
      toSecondaryInfo.exchangeCurrencyCode
    )
  } else {
    toCurrencyCode = ''
    toExchangeAmount = ''
    toPrimaryInfo = emptyCurrencyInfo
    toSecondaryInfo = emptyCurrencyInfo
    toNativeAmount = ''
    toButtonText = s.strings.select_recv_wallet
    toFiatToCrypto = 1
  }

  if (fromWallet && toWallet) {
    exchangeRate = state.cryptoExchange.exchangeRate
  }

  const showNextButton: boolean = !!state.cryptoExchange.transaction && state.cryptoExchange.transaction.nativeAmount !== '0'

  return {
    fromWallet: fromWallet || emptyGuiWallet,
    fromExchangeAmount,
    fromCurrencyCode,
    fromPrimaryInfo,
    fromSecondaryInfo,
    fromButtonText,
    fromFiatToCrypto,
    toWallet: toWallet || emptyGuiWallet,
    toExchangeAmount,
    toCurrencyCode,
    toPrimaryInfo,
    toSecondaryInfo,
    toButtonText,
    toFiatToCrypto,
    exchangeRate,
    fromDisplayAmount: state.cryptoExchange.fromDisplayAmount,
    toDisplayAmount: state.cryptoExchange.toDisplayAmount,
    fromCurrencyIcon: state.cryptoExchange.fromCurrencyIcon || '',
    fromCurrencyIconDark: state.cryptoExchange.fromCurrencyIconDark || '',
    toCurrencyIcon: state.cryptoExchange.toCurrencyIcon || '',
    toCurrencyIconDark: state.cryptoExchange.toCurrencyIconDark || '',
    fee: state.cryptoExchange.fee,
    flippedCounter: state.cryptoExchange.flippedCounter,
    showWalletSelectModal: state.cryptoExchange.walletListModalVisible,
    showConfirmShiftModal: state.cryptoExchange.confirmTransactionModalVisible,
    showNextButton
  }
}

export const mapDispatchToProps = (dispatch: Dispatch): CryptoExchangeSceneComponentDispatchProps => ({
  // selectFromWallet: (data: GuiWallet) => dispatch(actions.selectToFromWallet(Constants.SELECT_FROM_WALLET_CRYPTO_EXCHANGE, data)),
  // selectToWallet: (data: GuiWallet) => dispatch(actions.selectToFromWallet(Constants.SELECT_TO_WALLET_CRYPTO_EXCHANGE, data)),
  swapFromAndToWallets: () => dispatch(actions.dispatchAction(Constants.SWAP_FROM_TO_CRYPTO_WALLETS)),
  openModal: (data: string) => dispatch(actions.dispatchActionString(Constants.OPEN_WALLET_SELECTOR_MODAL, data)),
  shift: () => dispatch(actions.shiftCryptoCurrency()),
  closeConfirmation: () => dispatch(actions.dispatchAction(Constants.CLOSE_CRYPTO_EXC_CONF_MODAL)),
  openConfirmation: () => dispatch(actions.dispatchAction(Constants.OPEN_CRYPTO_EXC_CONF_MODAL)),
  setNativeAmount: (data: SetNativeAmountInfo) => dispatch(actions.setNativeAmount(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(CryptoExchangeSceneComponent)
