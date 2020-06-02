const Stream = require("./stream");

class DataStream {
	constructor(buffer) {
		this._stream = new Stream(buffer);

		this._readIndex = 0;
	}

	get buffer() {
		return this._stream.buffer;
	}

	writeUint8(value) {
		return this._stream.writeUint8(value);
	}
	writeInt8(value) {
		return this.writeUint8(value + 0b01111111);
	}
	writeUint16(value) {
		return this._stream.writeUint16(value);
	}
	writeInt16(value) {
		return this.writeUint16(value + 0b0111111111111111);
	}
	// writeUint32(value) { return this._stream.writeUint32(value); }
	//writeInt32 = (value) => this.writeUint32(value + 0b01111111111111111111111111111111);

	writeUint64AsString(value) {
		return this.writeString(value.toString());
	}

	writeString(value) {
		return this._stream.writeString(value);
	}
	writeNumberAsString(value) {
		if (typeof value !== "number")
			throw new Error("Value must be a number");
		return this.writeString(value.toString());
	}
	writeBoolean(value) {
		if (typeof value !== "boolean")
			throw new Error("Value must be a boolean");
		return this.writeUint8(!!value ? 1 : 0);
	}

	writeFunction(func) {
		if (typeof func !== "function")
			throw new Error("Value must be a function");

		return this.writeString(func.toString());
	}

	writeUint8Array(array) {
		return this._stream.writeUint8Array(array);
	}

	writeObject(object) {
		if (typeof object !== "object")
			throw new Error("Value must be a object");
		if (object === null) throw new Error("Object cannot be a null");

		const keys = Object.keys(object);
		this.writeUint16(keys.length);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			this.writeString(key);
			this.writeString(typeof object[key]);
			switch (typeof object[key]) {
				case "number":
					this.writeNumberAsString(object[key]);
					break;
				case "string":
					this.writeString(object[key]);
					break;
				case "boolean":
					this.writeBoolean(object[key]);
					break;
				case "object":
					this.writeObject(object[key]);
					break;
				case "function":
					this.writeFunction(object[key]);
					break;
				default:
					throw new Error("Unknown type");
			}
		}
	}

	readUint8() {
		return this._readAny(this._stream.readUint8);
	}
	readInt8() {
		return this.readUint8() - 0b01111111;
	}
	readUint16() {
		return this._readAny(this._stream.readUint16);
	}
	readInt16() {
		return this.readUint16() - 0b0111111111111111;
	}
	// readUint32() { return this._readAny(this._stream.readUint32);
	// readInt32() { return this.readUint32() - 0b01111111111111111111111111111111;

	readUint64AsString() {
		return parseFloat(this.readString());
	}

	readString() {
		return this._readAny(this._stream.readString);
	}

	readNumberAsString() {
		return parseFloat(this.readString());
	}
	readBoolean() {
		return this.readUint8() === 1 ? true : false;
	}

	readFunction() {
		let str = this.readString();
		// str.replace(/\n/g, ' ') - NOT WORKING!
		for (let i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) === 13) {
				str = str.slice(0, i) + " " + str.slice(i + 2);
			}
		}
		var funcReg = /(function)? *\(([^()]*)\) ?(=>)? [ \n\t]*{(.*)}/gim;
		var match = funcReg.exec(str);
		if (match) {
			return new Function(match[2].split(","), match[4]);
		}

		return null;
	}
	readObject() {
		const keysSize = this.readUint16();

		const result = {};

		for (let i = 0; i < keysSize; i++) {
			const key = this.readString();
			const type = this.readString();

			switch (type) {
				case "number":
					result[key] = this.readNumberAsString();
					break;
				case "string":
					result[key] = this.readString();
					break;
				case "boolean":
					result[key] = this.readBoolean();
					break;
				case "object":
					result[key] = this.readObject();
					break;
				case "function":
					result[key] = this.readFunction();
					break;
				default:
					throw new Error("Unknown type");
			}
		}

		return result;
	}

	readUint8Array() {
		const result = this._stream.readUint8Array(this._readIndex);
		this._readIndex += result.length + 2;
		return result;
	}

	_readAny(fn) {
		const [result, offset] = fn(this._readIndex);
		this._readIndex += offset;
		return result;
	}
}

module.exports = DataStream;
