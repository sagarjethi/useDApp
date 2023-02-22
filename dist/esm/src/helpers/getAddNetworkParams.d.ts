import { Chain } from '../constants';
export declare const getAddNetworkParams: (chain: Chain) => {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
};
//# sourceMappingURL=getAddNetworkParams.d.ts.map