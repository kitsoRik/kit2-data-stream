const Buffer = require("./buffer");

class Stream {
	constructor(buffer) {
		this._buffer = buffer instanceof Buffer ? buffer : new Buffer();

		this.readString = this.readString.bind(this);

		this.readUint8 = this.readUint8.bind(this);
		this.readUint16 = this.readUint16.bind(this);
		this.readUint32 = this.readUint32.bind(this);

		this.readUint8Array = this.readUint8Array.bind(this);

		this.writeString = this.writeString.bind(this);

		this.writeUint8 = this.writeUint8.bind(this);
		this.writeUint16 = this.writeUint16.bind(this);
		this.writeUint32 = this.writeUint32.bind(this);

		this.writeUint8Array = this.writeUint8Array.bind(this);
	}

	get buffer() {
		return this._buffer;
	}

	writeUint8(value) {
		this.buffer.set([value]);
	}

	writeUint16(value) {
		this.buffer.set([
			value & 0b0000000011111111,
			(value & 0b1111111100000000) >> 8,
		]);
	}

	writeUint32(value) {
		this.buffer.set([
			value & 0b00000000000000000000000011111111,
			(value & 0b00000000000000001111111100000000) >> 8,
			(value & 0b00000000111111110000000000000000) >> 16,
			(value & 0b11111111000000000000000000000000) >> 24,
		]);
	}

	writeString(value) {
		if (typeof value !== "string")
			throw new Error("Value must be a string");
		const size = value.length;
		this.writeUint16(size);

		for (let i = 0; i < size; i++) {
			this.writeUint16(value.charCodeAt(i));
		}
	}

	writeUint8Array(value) {
		this.writeString(value.length.toString());
		this.buffer.set(value);
	}

	readUint8(index) {
		return [this.buffer.get(index, 1)[0], 1];
	}

	readUint16(index) {
		const res = this.buffer.get(index, 2);
		return [res[0] + (res[1] << 8), 2];
	}

	readUint32(index) {
		const res = this.buffer.get(index, 4);
		return [res[0] + (res[1] << 8) + (res[2] << 16) + (res[3] << 24), 4];
	}

	readString(index) {
		const [size, uint16Size] = this.readUint16(index);
		let string = "";
		for (let i = 0; i < size; i++) {
			string += String.fromCharCode(
				this.readUint16(index + i * 2 + 2)[0]
			);
		}
		return [string, 2 + size * 2];
	}

	readUint8Array(index) {
		const [size, stringSize] = this.readString(index);
		return [
			this._buffer.get(index + stringSize, +size),
			stringSize + +size,
		];
	}
}

module.exports = Stream;
