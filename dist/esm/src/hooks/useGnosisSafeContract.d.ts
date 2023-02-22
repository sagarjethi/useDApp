import type { Signer, providers } from 'ethers';
import { Contract } from 'ethers';
/**
 * @internal Intended for internal use - use it on your own risk
 */
export declare const useGnosisSafeContract: (account: string | undefined, provider: Signer | providers.Provider | undefined) => {
    get: () => Contract;
};
//# sourceMappingURL=useGnosisSafeContract.d.ts.map