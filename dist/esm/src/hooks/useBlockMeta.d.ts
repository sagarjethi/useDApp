import { BigNumber } from 'ethers';
import { QueryParams } from '../constants/type/QueryParams';
/**
 * Queries block metadata.
 * @public
 */
export declare function useBlockMeta(queryParams?: QueryParams): {
    timestamp: Date;
    difficulty: BigNumber;
    blockNumber: number;
};
//# sourceMappingURL=useBlockMeta.d.ts.map