"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hyperspace = void 0;
const chainExplorerLink_1 = require("../../helpers/chainExplorerLink");
// const filecoincanUrl = 'https://filfox.info'
const hyperspaceEtherscanUrl = 'https://hyperspace.filfox.info';
// export const Filecoin: Chain = {
//   chainId: 314,
//   chainName: 'Filecoin',
//   isTestChain: false,
//   isLocalChain: false,
//   multicallAddress: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
//   nativeCurrency: {
//     name: 'Filecoin',
//     symbol: 'FIL',
//     decimals: 18,
//   },
//   blockExplorerUrl: filecoincanUrl,
//   getExplorerAddressLink: getAddressLink(filecoincanUrl),
//   getExplorerTransactionLink: getTransactionLink(filecoincanUrl),
// }
exports.Hyperspace = {
    chainId: 3141,
    chainName: 'Hyperspace',
    isTestChain: true,
    isLocalChain: false,
    multicallAddress: '0xBC980aa92b52091C24D26FCEC5b441aEd2c5a79d',
    nativeCurrency: {
        name: 'Hyperspace Filecoin',
        symbol: 'TFIL',
        decimals: 18,
    },
    blockExplorerUrl: hyperspaceEtherscanUrl,
    getExplorerAddressLink: (0, chainExplorerLink_1.getAddressLink)(hyperspaceEtherscanUrl),
    getExplorerTransactionLink: (0, chainExplorerLink_1.getTransactionLink)(hyperspaceEtherscanUrl),
};
exports.default = {
    Hyperspace: exports.Hyperspace
};
//# sourceMappingURL=filecoin.js.map