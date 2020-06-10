export class Buffer {
    constructor();

    static fromUint8Array(array: Uint8Array): Buffer;

    get size(): number;
    get length(): number;

    toUint8Array(): Uint8Array;
}

export class DataStream {
    private _stream: any;

    constructor(buffer?: Buffer);

    get buffer(): Buffer;

    writeUint8(value: number);
    writeInt8(value: number);
    writeUint16(value: number);
    writeInt16(value: number);

    writeString(value: string);
    writeNumberAsString(value: number);

    writeUint8Array(array: Uint8Array);

    writeBoolean(value: boolean);
    writeFunction(value: any);
    writeObject(object: object);

    readUint8(): number;
    readInt8(): number;
    readUint16(): number;
    readInt16(): number;

    readString(): string;
    readNumberAsString(): number;

    readUint8Array(): Uint8Array;

    readBoolean(): boolean;
    readFunction(): any;
    readObject(): object;
}