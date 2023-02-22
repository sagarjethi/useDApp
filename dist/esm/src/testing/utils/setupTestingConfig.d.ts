interface SetupTestingConfigOptions {
    multicallVersion: 1 | 2;
}
/**
 * Creates two networks of mock providers with multicalls,
 * and constructs a useDapp Config.
 * @internal
 */
export declare const setupTestingConfig: ({ multicallVersion }?: SetupTestingConfigOptions) => Promise<{
    config: {
        readOnlyChainId?: number;
        readOnlyUrls?: import("../../constants").NodeUrls;
        multicallAddresses?: import("../../constants").MulticallAddresses;
        multicallVersion?: 1 | 2;
        fastMulticallEncoding?: boolean;
        noMetamaskDeactivate?: boolean;
        supportedChains?: number[];
        networks?: import("../../constants").Chain[];
        pollingInterval?: number;
        pollingIntervals?: import("../../constants").PollingIntervals;
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
            [key: string]: import("../..").Connector;
        };
    };
    network1: import("./createMockProvider").CreateMockProviderResult;
    network2: import("./createMockProvider").CreateMockProviderResult;
}>;
export {};
//# sourceMappingURL=setupTestingConfig.d.ts.map