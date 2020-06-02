class Buffer {
	constructor() {
		this.__array = new Uint8Array();
	}

	static fromUint8Array(array) {
		const buffer = new Buffer();
		buffer.__array = array;
		return buffer;
	}

	get size() {
		return this.__array.length;
	}
	get length() {
		return this.__array.length;
	}

	resize(newSize) {
		if (this.size < newSize) {
			this.__array = new Uint8Array([
				...this.__array,
				...Array(newSize - this.size),
			]);
		}
	}

	set(array) {
		this.__array = new Uint8Array([...this.__array, ...array]);
	}

	get(index, length) {
		return this.__array.slice(index, index + length);
	}

	toUint8Array() {
		return this.__array;
	}
}

module.exports = Buffer;
