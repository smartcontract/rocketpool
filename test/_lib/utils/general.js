import { RocketStorage } from '../artifacts';

// The newer version of Web3. Waiting for them to upgrade truffles web3.
const $web3 = require('web3');
const FS = require('fs');
const ethUtils = require('ethereumjs-util');


// Print pretty test title
export function printTitle(user, desc) {
    return '\x1b[33m' + user + '\u001b[00m: \u001b[01;34m' + desc;
}

// Assert that an error is thrown
export async function assertThrows(promise, err) {
    try {
        await promise;
        assert.isNotOk(true, err);
    } catch (e) {
        assert.include(e.message, 'VM Exception');
    }
}

// RLP encode the given array argument
export function rlpEncode (argArray) {
    return ethUtils.rlphash(argArray);
}

// Get the gananche-cli private key
export function getGanachePrivateKey () {
    // Known private key because we start ganache with mnemonic "jungle neck govern chief unaware rubber frequent tissue service license alcohol velvet"
    return 'c6d2ac9b00bd599c4ce9d3a69c91e496eb9e79781d9dc84c79bafa7618f45f37';
}

// Get the ABI file - used for precompiled contracts
export function getABI (abiFilePath) {
    return JSON.parse(FS.readFileSync(abiFilePath));
}

// Get the address of a registered RP contract
export async function getContractAddressFromStorage (contractName) {
    // Contract dependencies
    let rocketStorage = await RocketStorage.deployed()
    return await rocketStorage.getAddress(soliditySha3('contract.name', contractName), {gas: 250000});
}

// Print the event to console
export function printEvent (type, result, colour) {
  console.log('\n');
  console.log(
    colour,
    '*** ' + type.toUpperCase() + ' EVENT: ' + result.event + ' *******************************'
  );
  console.log('\n');
  console.log(result.args);
  console.log('\n');
};

//  New web3 is used for hashing, the old one that comes with truffle does it incorrectly.
export function soliditySha3() {
    return $web3.utils.soliditySha3.apply($web3, Array.prototype.slice.call(arguments));
}

// Mine multiple blocks - used primarily for advancing Casper epochs
export async function mineBlockAmount(blockAmount) {
    const mineOneBlock = async () => {
        await web3.currentProvider.send({
          jsonrpc: '2.0',
          method: 'evm_mine',
          params: [],
          id: 0,
        })
      }
    for (let i = 0; i < blockAmount; i++) {
        await mineOneBlock();
    }
}

// Address formatting tools
export function removeTrailing0x(str) {
    if (str.startsWith('0x'))
        return str.substring(2);
    else return str;
}

export function addTrailing0x(str) {
    if (!str.startsWith('0x'))
        return '0x' + str;
    else return str;
}

// Pads a string to a certain length
export function paddy(string, padlen, padchar) {
    string = string.substr(0, 2) == '0x' ? string.slice(2) : string;
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + string).slice(-pad.length);
}
