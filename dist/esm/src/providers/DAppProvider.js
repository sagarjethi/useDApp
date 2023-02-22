import { useMemo } from 'react';
import { ConfigProvider } from './config';
import { MultiChainStateProvider } from './chainState';
import { useConfig } from '../hooks';
import { NotificationsProvider } from './notifications/provider';
import { TransactionProvider } from './transactions/provider';
import { LocalMulticallProvider } from './LocalMulticallProvider';
import { ReadonlyNetworksProvider } from './network';
import { BlockNumbersProvider } from './blockNumber/blockNumbers';
import { WindowProvider } from './window';
import { ConnectorContextProvider } from './network/connectors/context';
/**
 * Provides basic services for a DApp.
 * @public
 */
export function DAppProvider({ config, children }) {
    return (<ConfigProvider config={config}>
      <DAppProviderWithConfig>{children}</DAppProviderWithConfig>
    </ConfigProvider>);
}
const getMulticallAddresses = (networks) => {
    const result = {};
    networks === null || networks === void 0 ? void 0 : networks.forEach((network) => (result[network.chainId] = network.multicallAddress));
    return result;
};
const getMulticall2Addresses = (networks) => {
    const result = {};
    networks === null || networks === void 0 ? void 0 : networks.forEach((network) => {
        if (network.multicall2Address) {
            result[network.chainId] = network.multicall2Address;
        }
    });
    return result;
};
function DAppProviderWithConfig({ children }) {
    const { multicallAddresses, networks, multicallVersion } = useConfig();
    const defaultAddresses = useMemo(() => (multicallVersion === 1 ? getMulticallAddresses(networks) : getMulticall2Addresses(networks)), [networks, multicallVersion]);
    const multicallAddressesMerged = useMemo(() => (Object.assign(Object.assign({}, defaultAddresses), multicallAddresses)), [
        defaultAddresses,
        multicallAddresses,
    ]);
    return (<WindowProvider>
      <ReadonlyNetworksProvider>
        <ConnectorContextProvider>
          <BlockNumbersProvider>
            <LocalMulticallProvider>
              <MultiChainStateProvider multicallAddresses={multicallAddressesMerged}>
                <NotificationsProvider>
                  <TransactionProvider>{children}</TransactionProvider>
                </NotificationsProvider>
              </MultiChainStateProvider>
            </LocalMulticallProvider>
          </BlockNumbersProvider>
        </ConnectorContextProvider>
      </ReadonlyNetworksProvider>
    </WindowProvider>);
}
//# sourceMappingURL=DAppProvider.js.map