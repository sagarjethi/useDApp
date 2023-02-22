import { Chain, FullConfig } from '../constants';
/**
 * Returns singleton instance of {@link Config}.
 * Takes no parameters.
 * @public
 */
export declare function useConfig(): FullConfig | Record<string, never>;
/**
 * @public
 */
export declare function useUpdateConfig(): (config: {
    readOnlyChainId?: number;
    readOnlyUrls?: import("../constants").NodeUrls;
    multicallAddresses?: import("../constants").MulticallAddresses;
    multicallVersion?: 1 | 2;
    fastMulticallEncoding?: boolean;
    noMetamaskDeactivate?: boolean;
    supportedChains?: number[];
    networks?: Chain[];
    pollingInterval?: number;
    pollingIntervals?: import("../constants").PollingIntervals;
    notifications?: {
        checkInterval?: number;
        expirationPeriod?: number;
    };
    localStorage?: {
        transactionPath: string;
    };
    gasLimitBufferPercentage?: number;
    bufferGasLimitPercentage?: number;
    autoConnect?: boolean;
    refresh?: number | "never" | "everyBlock";
    localStorageOverride?: Storage;
    connectors?: {
        [key: string]: import("../providers").Connector;
    };
}) => void;
//# sourceMappingURL=useConfig.d.ts.map