import { BinaryMichelineEncoder } from './binaryMichelineEncoder.js';
import { hexBytes } from './utils.js';

const targetAddress = 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR';
const id = 'testId';
const amount = '17170000';

const encoder = new BinaryMichelineEncoder();
const targetAddressBytes = hexBytes(encoder.encodeAddress(targetAddress));// '019af3138763ec09dde90926f5a6b60783a21607d500';

const data = hexBytes(encoder.encodeMichelsonData({
    prim: 'Pair',
    args: [
        {
            prim: 'Pair',
            args: [
                { string: id },
                { bytes:  targetAddressBytes }
            ]
        },
        {
            int: amount
        }
    ]
}));

console.log(data);