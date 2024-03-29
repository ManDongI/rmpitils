import StructuredPacket from '../src/StructuredPacket.mjs';
import WrappedBuffer from '../src/WrappedBuffer.mjs';

class StringArrayPacket extends StructuredPacket {
    static id = 100;

    strArr = [];

    decode() {
        super.decode();
        this.strArr = this.wbuf.readLArray('LString');
    }

    encode() {
        super.encode();
        this.wbuf.writeLArray(this.strArr, 'LString');
    }

    getEstimatedSize() {
        return 4 + this.strArr.map(e => Buffer.from(e, 'utf8').length)
            .reduce((a, b) => a + b) + 4 * this.strArr.length;
    }
}

let original = ['Hello', 'World!'];
let originalBuf = Buffer.alloc(24);
originalBuf[0] = 99; // weird
let helloWorld = new WrappedBuffer(originalBuf.subarray(1));
helloWorld.writeLArray(original, 'LString');
let testPacket = new StringArrayPacket(originalBuf);
testPacket.decode();
console.assert(testPacket.strArr.every((e, i) => original[i] === e));
original = ['Hello12332142345235', 'World3847238457923874892374'];
testPacket.strArr = original;
console.log(testPacket.getEstimatedSize(), testPacket.getRealSize());
testPacket.encode();
testPacket.decode();
console.assert(testPacket.strArr.every((e, i) => original[i] === e));
console.log(testPacket.getRawData());