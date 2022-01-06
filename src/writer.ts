export class Writer {
    public buffer: number[] = [];

    get length(): number {
        return this.buffer.length;
    }

    writeBytes(val: number[]) {
        this.buffer.push(...val.map(v => v & 0xff));
    }

    writeUint8(val: number) {
        const v = val | 0;
        this.buffer.push(v & 0xff);
    }

    writeUint16(val: number) {
        const v = val | 0;
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }

    writeUint32(val: number) {
        const v = val | 0;
        this.buffer.push((v >> 24) & 0xff);
        this.buffer.push((v >> 16) & 0xff);
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }

    writeInt8(val: number) {
        this.writeUint8(val);
    }

    writeInt16(val: number) {
        this.writeUint16(val);
    }

    writeInt32(val: number) {
        this.writeUint32(val);
    }
}