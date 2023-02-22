import { RenderResult } from '@testing-library/react-hooks';
import { Contract } from 'ethers';
import { CallResult } from '../../helpers';
export type HookResult = {
    [key: string]: CallResult<Contract, string>;
};
export declare const getResultProperty: <T extends HookResult>(result: RenderResult<T>, property: keyof T) => any;
export declare const getResultPropertyError: <T extends HookResult>(result: RenderResult<T>, property: keyof T) => Error;
//# sourceMappingURL=getResultProperty.d.ts.map