import { ethers, providers } from 'ethers';
import { TransactionOptions } from '../model';
type BaseProvider = providers.BaseProvider;
type JsonRpcProvider = providers.JsonRpcProvider;
type FallbackProvider = providers.FallbackProvider;
export declare const getSignerFromOptions: (provider: BaseProvider, options?: TransactionOptions, library?: JsonRpcProvider | FallbackProvider) => ethers.Signer | ethers.providers.JsonRpcSigner | ethers.Wallet;
export {};
//# sourceMappingURL=getSignerFromOptions.d.ts.map