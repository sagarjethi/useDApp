"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const useCall_1 = require("./useCall");
const chai_1 = require("chai");
const testing_1 = require("../testing");
const ethereum_waffle_1 = require("ethereum-waffle");
const constants_1 = require("../constants");
const wait_for_expect_1 = __importDefault(require("wait-for-expect"));
const errors_1 = require("../constants/abi/errors");
const constants_2 = require("../abi/multicall/constants");
describe('useCall', () => {
    for (const multicallVersion of [1, 2]) {
        describe(`Multicall v${multicallVersion}`, () => {
            it('initial test balance to be correct', async () => {
                var _a;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const token = await (0, testing_1.deployMockToken)(network1.deployer);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => (0, useCall_1.useCall)({
                    contract: token,
                    method: 'balanceOf',
                    args: [network1.deployer.address],
                }), {
                    config,
                });
                await waitForCurrent((val) => val !== undefined);
                (0, chai_1.expect)(result.error).to.be.undefined;
                (0, chai_1.expect)((_a = result.current) === null || _a === void 0 ? void 0 : _a.value[0]).to.eq(testing_1.MOCK_TOKEN_INITIAL_BALANCE);
            });
            it('returns error on revert', async () => {
                var _a, _b, _c;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const revertContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.reverterContractABI);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => (0, useCall_1.useCall)({
                    contract: revertContract,
                    method: 'doRevert',
                    args: [],
                }), {
                    config,
                });
                await waitForCurrent((val) => val !== undefined);
                (0, chai_1.expect)((_a = result.current) === null || _a === void 0 ? void 0 : _a.value).to.be.undefined;
                (0, chai_1.expect)(typeof ((_c = (_b = result.current) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message)).to.eq('string');
            });
            it('returns information about missing cause message', async () => {
                var _a, _b;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const errorsContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, errors_1.errorsContractABI);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => {
                    const revert = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doRevertWithoutMessage',
                        args: [],
                    });
                    const requireFail = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doRequireFailWithoutMessage',
                        args: [],
                    });
                    return { revert, requireFail };
                }, {
                    config,
                });
                await waitForCurrent(({ revert, requireFail }) => !!(revert && requireFail));
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'revert')).to.be.undefined;
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'requireFail')).to.be.undefined;
                (0, chai_1.expect)((_a = (0, testing_1.getResultPropertyError)(result, 'revert')) === null || _a === void 0 ? void 0 : _a.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'Call reverted without a cause message');
                (0, chai_1.expect)((_b = (0, testing_1.getResultPropertyError)(result, 'requireFail')) === null || _b === void 0 ? void 0 : _b.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'Call reverted without a cause message');
            });
            it('returns revert cause message', async () => {
                var _a, _b;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const errorsContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, errors_1.errorsContractABI);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => {
                    const revertCall = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doRevert',
                        args: [],
                    });
                    const requireFailCall = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doRequireFail',
                        args: [],
                    });
                    return { revertCall, requireFailCall };
                }, {
                    config,
                });
                await waitForCurrent(({ revertCall, requireFailCall }) => !!(revertCall && requireFailCall));
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'revertCall')).to.be.undefined;
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'requireFailCall')).to.be.undefined;
                (0, chai_1.expect)((_a = (0, testing_1.getResultPropertyError)(result, 'revertCall')) === null || _a === void 0 ? void 0 : _a.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'Revert cause');
                (0, chai_1.expect)((_b = (0, testing_1.getResultPropertyError)(result, 'requireFailCall')) === null || _b === void 0 ? void 0 : _b.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'Require cause');
            });
            it('returns panic code', async () => {
                var _a, _b;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const errorsContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, errors_1.errorsContractABI);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => {
                    const assertFailCall = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doThrow',
                        args: [],
                    });
                    const panicCall = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doPanic',
                        args: [],
                    });
                    return { assertFailCall, panicCall };
                }, {
                    config,
                });
                await waitForCurrent(({ assertFailCall, panicCall }) => !!(assertFailCall && panicCall));
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'assertFailCall')).to.be.undefined;
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'panicCall')).to.be.undefined;
                (0, chai_1.expect)((_a = (0, testing_1.getResultPropertyError)(result, 'assertFailCall')) === null || _a === void 0 ? void 0 : _a.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'panic code 0x01');
                (0, chai_1.expect)((_b = (0, testing_1.getResultPropertyError)(result, 'panicCall')) === null || _b === void 0 ? void 0 : _b.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'panic code 0x12');
            });
            it('returns custom error name', async () => {
                var _a, _b;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const errorsContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, errors_1.errorsContractABI);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => {
                    const revertWithOne = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doRevertWithOne',
                        args: [],
                    });
                    const revertWithTwo = (0, useCall_1.useCall)({
                        contract: errorsContract,
                        method: 'doRevertWithTwo',
                        args: [],
                    });
                    return { revertWithOne, revertWithTwo };
                }, {
                    config,
                });
                await waitForCurrent(({ revertWithOne, revertWithTwo }) => !!(revertWithOne && revertWithTwo));
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'revertWithOne')).to.be.undefined;
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'revertWithTwo')).to.be.undefined;
                (0, chai_1.expect)((_a = (0, testing_1.getResultPropertyError)(result, 'revertWithOne')) === null || _a === void 0 ? void 0 : _a.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'error One');
                (0, chai_1.expect)((_b = (0, testing_1.getResultPropertyError)(result, 'revertWithTwo')) === null || _b === void 0 ? void 0 : _b.message).to.eq(multicallVersion === 1 ? constants_2.defaultMulticall1ErrorMessage : 'error Two');
            });
            it('multichain calls return correct initial balances', async () => {
                const { config, network1, network2 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const token = await (0, testing_1.deployMockToken)(network1.deployer);
                const secondToken = await (0, testing_1.deployMockToken)(network2.deployer, testing_1.SECOND_MOCK_TOKEN_INITIAL_BALANCE);
                await testMultiChainUseCall(token, [network1.deployer.address], network1.chainId, testing_1.MOCK_TOKEN_INITIAL_BALANCE, config);
                await testMultiChainUseCall(secondToken, [network2.deployer.address], network2.chainId, testing_1.SECOND_MOCK_TOKEN_INITIAL_BALANCE, config);
            });
            const testMultiChainUseCall = async (contract, args, chainId, endValue, 
            // eslint-disable-next-line no-undef
            config) => {
                var _a;
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => (0, useCall_1.useCall)({
                    contract,
                    method: 'balanceOf',
                    args,
                }, { chainId }), {
                    config,
                });
                await waitForCurrent((val) => val !== undefined);
                (0, chai_1.expect)(result.error).to.be.undefined;
                (0, chai_1.expect)((_a = result.current) === null || _a === void 0 ? void 0 : _a.value[0]).to.eq(endValue);
            };
            it('Properly handles two calls', async () => {
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const token = await (0, testing_1.deployMockToken)(network1.deployer);
                const blockNumberContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.BlockNumberContract);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => {
                    const balance = (0, useCall_1.useCall)({
                        contract: token,
                        method: 'balanceOf',
                        args: [network1.deployer.address],
                    });
                    const block = (0, useCall_1.useCall)({
                        contract: blockNumberContract,
                        method: 'getBlockNumber',
                        args: [],
                    });
                    return { balance, block };
                }, {
                    config,
                });
                const blockNumber = await network1.provider.getBlockNumber();
                await waitForCurrent(({ balance, block }) => !!(balance && block));
                (0, chai_1.expect)(result.error).to.be.undefined;
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'balance')).to.eq(testing_1.MOCK_TOKEN_INITIAL_BALANCE);
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block')).to.eq(blockNumber);
                await network1.mineBlock();
                await (0, wait_for_expect_1.default)(() => {
                    (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'balance')).to.eq(testing_1.MOCK_TOKEN_INITIAL_BALANCE);
                    (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block')).to.eq(blockNumber + 1);
                });
            });
            it('Properly handles refresh per block', async () => {
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const blockNumberContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.BlockNumberContract);
                const secondBlockNumberContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.BlockNumberContract);
                const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => {
                    const block1 = (0, useCall_1.useCall)({
                        contract: blockNumberContract,
                        method: 'getBlockNumber',
                        args: [],
                    });
                    const block2 = (0, useCall_1.useCall)({
                        // TODO: add similar test but with the same contract (blockNumberContract). It would currently fail
                        contract: secondBlockNumberContract,
                        method: 'getBlockNumber',
                        args: [],
                    }, {
                        refresh: 2,
                    });
                    return { block1, block2 };
                }, {
                    config,
                });
                const blockNumber = await network1.provider.getBlockNumber();
                await waitForCurrent(({ block1, block2 }) => !!(block1 && block2));
                (0, chai_1.expect)(result.error).to.be.undefined;
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block1')).to.eq(blockNumber);
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block2')).to.eq(blockNumber);
                await network1.mineBlock();
                await waitForCurrent(({ block1 }) => block1 !== undefined && block1.value[0].toNumber() === blockNumber + 1);
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block1')).to.eq(blockNumber + 1);
                (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block2')).to.eq(blockNumber);
                await network1.mineBlock();
                await (0, wait_for_expect_1.default)(() => {
                    (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block1')).to.eq(blockNumber + 2);
                    (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block2')).to.eq(blockNumber + 2);
                });
                for (let i = 0; i < 3; i++) {
                    await network1.mineBlock();
                }
                await (0, wait_for_expect_1.default)(() => {
                    (0, chai_1.expect)((0, testing_1.getResultProperty)(result, 'block1')).to.eq(blockNumber + 5);
                    const block2 = (0, testing_1.getResultProperty)(result, 'block2').toNumber();
                    // we don't actually know when the update is gonna happen - both possibilities are possible
                    (0, chai_1.expect)(block2 === blockNumber + 4 || block2 === blockNumber + 5).to.be.true;
                });
            });
            it('Refreshes static call on parameter change', async () => {
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const doublerContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.doublerContractABI);
                const { waitForCurrent, rerender } = await (0, testing_1.renderDAppHook)(({ num }) => (0, useCall_1.useCall)({
                    contract: doublerContract,
                    method: 'double',
                    args: [num],
                }), {
                    config: {
                        ...config,
                        refresh: 'never',
                    },
                    renderHook: {
                        initialProps: {
                            num: 1,
                        },
                    },
                });
                await waitForCurrent((val) => { var _a, _b; return (_b = (_a = val === null || val === void 0 ? void 0 : val.value) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.eq(2); });
                rerender({ num: 2 });
                await waitForCurrent((val) => { var _a, _b; return (_b = (_a = val === null || val === void 0 ? void 0 : val.value) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.eq(4); });
            });
            it('Refreshes only static calls with changed parameter', async () => {
                var _a, _b, _c, _d;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)();
                const doublerContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.doublerContractABI);
                const blockNumberContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.BlockNumberContract);
                const { waitForCurrent, rerender, result } = await (0, testing_1.renderDAppHook)(({ num }) => {
                    const doubled = (0, useCall_1.useCall)({
                        contract: doublerContract,
                        method: 'double',
                        args: [num],
                    });
                    const blockNumber = (0, useCall_1.useCall)({
                        contract: blockNumberContract,
                        method: 'getBlockNumber',
                        args: [],
                    });
                    return { doubled, blockNumber };
                }, {
                    config: {
                        ...config,
                        refresh: 'never',
                    },
                    renderHook: {
                        initialProps: {
                            num: 1,
                        },
                    },
                });
                await waitForCurrent((val) => { var _a, _b, _c; return (_c = (_b = (_a = val === null || val === void 0 ? void 0 : val.doubled) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.eq(2); });
                const blockNumberBefore = (_a = result.current.blockNumber) === null || _a === void 0 ? void 0 : _a.value[0];
                await network1.mineBlock();
                (0, chai_1.expect)((_b = result.current.doubled) === null || _b === void 0 ? void 0 : _b.value[0]).to.eq(2);
                (0, chai_1.expect)((_c = result.current.blockNumber) === null || _c === void 0 ? void 0 : _c.value[0]).to.eq(blockNumberBefore);
                rerender({ num: 2 });
                await waitForCurrent((val) => { var _a, _b, _c; return (_c = (_b = (_a = val === null || val === void 0 ? void 0 : val.doubled) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.eq(4); });
                (0, chai_1.expect)((_d = result.current.blockNumber) === null || _d === void 0 ? void 0 : _d.value[0]).to.eq(blockNumberBefore);
            });
            it('should not throw error when call is Falsy', async () => {
                const { result, waitForNextUpdate } = await (0, testing_1.renderDAppHook)(() => (0, useCall_1.useCall)(null));
                await waitForNextUpdate();
                (0, chai_1.expect)(result.error).to.be.undefined;
                (0, chai_1.expect)(result.current).to.be.undefined;
            });
            describe('Invalid arguments', () => {
                let network1;
                let config;
                let token;
                before(async () => {
                    ;
                    ({ config, network1 } = await (0, testing_1.setupTestingConfig)());
                    token = await (0, testing_1.deployMockToken)(network1.deployer);
                });
                it('Returns error with invalid argument type', async () => {
                    var _a, _b, _c;
                    const args = [123];
                    const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => (0, useCall_1.useCall)({
                        contract: token,
                        method: 'balanceOf',
                        args,
                    }), {
                        config,
                    });
                    await waitForCurrent((val) => val !== undefined);
                    (0, chai_1.expect)((_a = result.current) === null || _a === void 0 ? void 0 : _a.value).to.be.undefined;
                    (0, chai_1.expect)((_c = (_b = result.current) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message).to.eq(`Invalid contract call for method="balanceOf" on contract="${token.address}": invalid address (argument="address", value=123, code=INVALID_ARGUMENT, version=address/5.6.1) (argument="account", value=123, code=INVALID_ARGUMENT, version=abi/5.6.4)`);
                });
                it('Returns error if too few arguments', async () => {
                    var _a, _b, _c;
                    const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => (0, useCall_1.useCall)({
                        contract: token,
                        method: 'balanceOf',
                        args: [],
                    }), {
                        config,
                    });
                    await waitForCurrent((val) => val !== undefined);
                    (0, chai_1.expect)((_a = result.current) === null || _a === void 0 ? void 0 : _a.value).to.be.undefined;
                    (0, chai_1.expect)((_c = (_b = result.current) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message).to.eq(`Invalid contract call for method="balanceOf" on contract="${token.address}": types/values length mismatch (count={"types":1,"values":0}, value={"types":[{"name":"account","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true}],"values":[]}, code=INVALID_ARGUMENT, version=abi/5.6.4)`);
                });
                it('Returns error if too many arguments', async () => {
                    var _a, _b, _c;
                    const args = [ethers_1.constants.AddressZero, ethers_1.constants.AddressZero];
                    const { result, waitForCurrent } = await (0, testing_1.renderDAppHook)(() => (0, useCall_1.useCall)({
                        contract: token,
                        method: 'balanceOf',
                        args,
                    }), {
                        config,
                    });
                    await waitForCurrent((val) => val !== undefined);
                    (0, chai_1.expect)((_a = result.current) === null || _a === void 0 ? void 0 : _a.value).to.be.undefined;
                    (0, chai_1.expect)((_c = (_b = result.current) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message).to.eq(`Invalid contract call for method="balanceOf" on contract="${token.address}": types/values length mismatch (count={"types":1,"values":2}, value={"types":[{"name":"account","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true}],"values":["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]}, code=INVALID_ARGUMENT, version=abi/5.6.4)`);
                });
            });
            it('keeps calls order on first and next renders', async () => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
                const { config, network1 } = await (0, testing_1.setupTestingConfig)({ multicallVersion });
                const doublerContract = await (0, ethereum_waffle_1.deployContract)(network1.deployer, constants_1.doublerContractABI);
                const { result, waitForCurrent, rerender } = await (0, testing_1.renderDAppHook)(({ num }) => {
                    const validCall = {
                        contract: doublerContract,
                        method: 'double',
                        args: [num],
                    };
                    const invalidCall = {
                        contract: doublerContract,
                        method: 'double',
                        args: ['invalid'],
                    };
                    return (0, useCall_1.useCalls)([validCall, null, invalidCall, validCall]);
                }, {
                    config,
                    renderHook: {
                        initialProps: {
                            num: 2,
                        },
                    },
                });
                await waitForCurrent((val) => { var _a, _b; return val !== undefined && !!((_a = val[0]) === null || _a === void 0 ? void 0 : _a.value) && !!((_b = val[3]) === null || _b === void 0 ? void 0 : _b.value); });
                (0, chai_1.expect)((_b = (_a = result.current[0]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b[0]).to.eq(ethers_1.BigNumber.from(4));
                (0, chai_1.expect)((_c = result.current[0]) === null || _c === void 0 ? void 0 : _c.error).to.be.undefined;
                (0, chai_1.expect)((_d = result.current[1]) === null || _d === void 0 ? void 0 : _d.error).to.be.undefined;
                (0, chai_1.expect)((_e = result.current[1]) === null || _e === void 0 ? void 0 : _e.value).to.be.undefined;
                (0, chai_1.expect)((_f = result.current[2]) === null || _f === void 0 ? void 0 : _f.value).to.be.undefined;
                (0, chai_1.expect)((_h = (_g = result.current[2]) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.message).to.eq(`Invalid contract call for method="double" on contract="${doublerContract.address}": invalid BigNumber string (argument="value", value="invalid", code=INVALID_ARGUMENT, version=bignumber/5.6.2)`);
                (0, chai_1.expect)((_k = (_j = result.current[3]) === null || _j === void 0 ? void 0 : _j.value) === null || _k === void 0 ? void 0 : _k[0]).to.eq(ethers_1.BigNumber.from(4));
                (0, chai_1.expect)((_l = result.current[3]) === null || _l === void 0 ? void 0 : _l.error).to.be.undefined;
                rerender({ num: 3 });
                await waitForCurrent((val) => { var _a, _b; return val !== undefined && !!((_a = val[0]) === null || _a === void 0 ? void 0 : _a.value) && !!((_b = val[3]) === null || _b === void 0 ? void 0 : _b.value); });
                (0, chai_1.expect)((_o = (_m = result.current[0]) === null || _m === void 0 ? void 0 : _m.value) === null || _o === void 0 ? void 0 : _o[0]).to.eq(ethers_1.BigNumber.from(6));
                (0, chai_1.expect)((_p = result.current[0]) === null || _p === void 0 ? void 0 : _p.error).to.be.undefined;
                (0, chai_1.expect)((_q = result.current[1]) === null || _q === void 0 ? void 0 : _q.error).to.be.undefined;
                (0, chai_1.expect)((_r = result.current[1]) === null || _r === void 0 ? void 0 : _r.value).to.be.undefined;
                (0, chai_1.expect)((_s = result.current[2]) === null || _s === void 0 ? void 0 : _s.value).to.be.undefined;
                (0, chai_1.expect)((_u = (_t = result.current[2]) === null || _t === void 0 ? void 0 : _t.error) === null || _u === void 0 ? void 0 : _u.message).to.eq(`Invalid contract call for method="double" on contract="${doublerContract.address}": invalid BigNumber string (argument="value", value="invalid", code=INVALID_ARGUMENT, version=bignumber/5.6.2)`);
                (0, chai_1.expect)((_w = (_v = result.current[3]) === null || _v === void 0 ? void 0 : _v.value) === null || _w === void 0 ? void 0 : _w[0]).to.eq(ethers_1.BigNumber.from(6));
                (0, chai_1.expect)((_x = result.current[3]) === null || _x === void 0 ? void 0 : _x.error).to.be.undefined;
            });
        });
    }
});
//# sourceMappingURL=useCall.test.js.map