import { isNil } from 'lodash';
import { useContext, useMemo } from 'react';

import { CHAIN_CONFIG } from '@/config/chains';
import { BalanceContext, WalletBalanceResult } from '@/context/BalanceProvider';
import { WalletOwnerType, WalletType } from '@/enums/Wallet';
import { Optional } from '@/types/Util';

import { useService } from './useService';
import { useServices } from './useServices';
import { useMasterWalletContext } from './useWallet';

export const useBalanceContext = () => useContext(BalanceContext);

/**
 * Balances relevant to a specific service (agent)
 * @param serviceConfigId
 * @returns
 */
export const useServiceBalances = (serviceConfigId: string | undefined) => {
  const { selectedAgentConfig } = useServices();
  const homeChainId = selectedAgentConfig.evmHomeChainId;

  const { nativeToken } = CHAIN_CONFIG[homeChainId];

  const { flatAddresses, serviceSafes, serviceEoa } =
    useService(serviceConfigId);
  const { walletBalances, stakedBalances } = useBalanceContext();

  /**
   * Staked balances, only relevant to safes
   */
  const serviceStakedBalances = useMemo(
    () =>
      stakedBalances?.filter((balance) =>
        flatAddresses.includes(balance.walletAddress),
      ),
    [flatAddresses, stakedBalances],
  );

  /**
   * Cross-chain unstaked balances in service safes
   */
  const serviceSafeBalances = useMemo<Optional<WalletBalanceResult[]>>(
    () =>
      walletBalances?.filter((balance) =>
        serviceSafes.find(({ address }) => balance.walletAddress === address),
      ),
    [serviceSafes, walletBalances],
  );

  /**
   * Cross-chain unstaked balances in service eoa (signer)
   */
  const serviceEoaBalances = useMemo<Optional<WalletBalanceResult[]>>(
    () =>
      walletBalances?.filter(
        (balance) => balance.walletAddress === serviceEoa?.address,
      ),
    [serviceEoa?.address, walletBalances],
  );

  /**
   * Balances i.e. native, erc20, etc
   * Across all service wallets, including eoa
   * @note NOT STAKED BALANCES
   */
  const serviceWalletBalances = useMemo<Optional<WalletBalanceResult[]>>(() => {
    let result;
    if (serviceSafeBalances || serviceEoaBalances) {
      result = [...(serviceSafeBalances || []), ...(serviceEoaBalances || [])];
    }
    return result;
  }, [serviceEoaBalances, serviceSafeBalances]);

  /**
   * Native service safe
   * @example XDAI on gnosis
   */
  const serviceSafeNative = useMemo(
    () =>
      serviceSafeBalances?.find(
        ({ isNative, evmChainId }) =>
          isNative && evmChainId === selectedAgentConfig.evmHomeChainId,
      ),
    [serviceSafeBalances, selectedAgentConfig],
  );

  /**
   * Check if service safe native balance is below threshold
   */
  const isServiceSafeLowOnNativeGas = useMemo(() => {
    if (!serviceSafeNative) return;
    if (!nativeToken?.symbol) return;

    const nativeGasRequirement =
      selectedAgentConfig.operatingThresholds[WalletOwnerType.Agent][
        WalletType.Safe
      ][nativeToken.symbol];

    return serviceSafeNative.balance < nativeGasRequirement;
  }, [serviceSafeNative, nativeToken, selectedAgentConfig]);

  return {
    serviceWalletBalances,
    serviceStakedBalances,
    serviceSafeBalances,
    serviceEoaBalances,
    serviceSafeNative,
    isServiceSafeLowOnNativeGas,
  };
};

/**
 * Balances relevant to the master wallets, eoa, and safes
 * @note master wallets are *shared* wallets across all services
 * @note master safe addresses are deterministic, and should be the same
 */
export const useMasterBalances = () => {
  const { selectedAgentConfig } = useServices();
  const { masterSafes, masterEoa } = useMasterWalletContext();
  const { isLoaded, walletBalances } = useBalanceContext();

  const masterSafeBalances = useMemo<Optional<WalletBalanceResult[]>>(
    () =>
      walletBalances?.filter(({ walletAddress }) =>
        masterSafes?.find(
          ({ address: masterSafeAddress, evmChainId }) =>
            walletAddress === masterSafeAddress &&
            selectedAgentConfig.requiresAgentSafesOn.includes(evmChainId),
        ),
      ),
    [masterSafes, walletBalances, selectedAgentConfig.requiresAgentSafesOn],
  );

  const masterEoaBalances = useMemo<Optional<WalletBalanceResult[]>>(
    () =>
      walletBalances?.filter(
        ({ walletAddress }) => walletAddress === masterEoa?.address,
      ),
    [masterEoa?.address, walletBalances],
  );

  /**
   * Unstaked balances across master safes and eoas
   */
  const masterWalletBalances = useMemo<Optional<WalletBalanceResult[]>>(() => {
    return [...(masterSafeBalances || []), ...(masterEoaBalances || [])];
  }, [masterEoaBalances, masterSafeBalances]);

  const homeChainNativeToken = useMemo(() => {
    if (!selectedAgentConfig?.evmHomeChainId) return;
    return CHAIN_CONFIG[selectedAgentConfig.evmHomeChainId].nativeToken;
  }, [selectedAgentConfig.evmHomeChainId]);

  const masterSafeNative = useMemo(() => {
    if (!masterSafeBalances) return;
    if (!selectedAgentConfig?.evmHomeChainId) return;
    if (!homeChainNativeToken) return;

    return masterSafeBalances.find(
      ({ isNative, evmChainId, symbol }) =>
        isNative &&
        evmChainId === selectedAgentConfig.evmHomeChainId &&
        symbol === homeChainNativeToken.symbol,
    );
  }, [
    masterSafeBalances,
    selectedAgentConfig.evmHomeChainId,
    homeChainNativeToken,
  ]);

  /**
   * Check if master safe native balance is below threshold
   */
  const isMasterSafeLowOnNativeGas = useMemo(() => {
    if (!masterSafeNative) return;
    if (!homeChainNativeToken?.symbol) return;

    const nativeGasRequirement =
      selectedAgentConfig.operatingThresholds[WalletOwnerType.Master][
        WalletType.Safe
      ][homeChainNativeToken.symbol];

    if (isNil(nativeGasRequirement)) return;

    return masterSafeNative.balance < nativeGasRequirement;
  }, [masterSafeNative, homeChainNativeToken, selectedAgentConfig]);

  const masterEoaNative = useMemo(() => {
    if (!masterEoaBalances) return;
    if (!selectedAgentConfig?.evmHomeChainId) return;
    if (!homeChainNativeToken) return;

    return masterEoaBalances.find(
      ({ isNative, evmChainId, symbol }) =>
        isNative &&
        evmChainId === selectedAgentConfig.evmHomeChainId &&
        symbol === homeChainNativeToken.symbol,
    );
  }, [
    masterEoaBalances,
    selectedAgentConfig.evmHomeChainId,
    homeChainNativeToken,
  ]);

  return {
    isLoaded,
    masterWalletBalances,
    masterSafeBalances,
    masterEoaBalances,
    isMasterSafeLowOnNativeGas,

    // Native gas balance. Eg. XDAI on gnosis
    masterSafeNativeGasBalance: masterSafeNative?.balance,
    masterEoaNativeGasBalance: masterEoaNative?.balance,
  };
};
