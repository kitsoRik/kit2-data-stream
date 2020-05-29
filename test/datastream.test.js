var assert = require('assert');
const { expect } = require('chai');

const { DataStream } = require('..');

describe('DataStream', () => {

    describe("int", () => {
        const ds = new DataStream();
        it('should write int8', () => {
            expect(ds.writeInt8(128 - 4)).to.does.not.throw;
            expect(ds.writeInt8(128 + 6)).to.does.not.throw;
            expect(ds.writeInt8(128 + 6)).to.does.not.throw;
        });

        it('should read int8', () => {
            expect(ds.readInt8()).to.equal(128 - 4);
        });

        it('should read int8 with not equal', () => {
            expect(ds.readInt8()).to.not.equal(128 + 6);
        });

        it('should read int8 with offset', () => {
            expect(ds.readInt8()).to.equal(-128 + 6);
        });

        it('should write int16', () => {
            expect(ds.writeInt16(32768 - 123)).to.does.not.throw;
            expect(ds.writeInt16(32768 + 10)).to.does.not.throw;
            expect(ds.writeInt16(32768 + 10)).to.does.not.throw;
        });

        it('should read int16', () => {
            expect(ds.readInt16()).to.equal(32768 - 123);
        });

        it('should read int16 with not equal', () => {
            expect(ds.readInt16()).to.not.equal(32768 + 10);
        });

        it('should read int16 with offset', () => {
            expect(ds.readInt16()).to.equal(-32768 + 10);
        });

        // it('should write int32', () => {
        //     expect(ds.writeInt32(2147483648 - 123)).to.does.not.throw;
        //     expect(ds.writeInt32(2147483648 + 10)).to.does.not.throw;
        //     expect(ds.writeInt32(2147483648 + 10)).to.does.not.throw;
        // });

        // it('should read int32', () => {
        //     expect(ds.readInt32()).to.equal(2147483648 - 123);
        // });

        // it('should read int32 with not equal', () => {
        //     expect(ds.readInt32()).to.not.equal(2147483648 + 10);
        // });

        // it('should read int32 with offset', () => {
        //     expect(ds.readInt32()).to.equal(-2147483648 + 10);
        // });
    });

    describe("number", () => {
        const ds = new DataStream();
        const number = 228;
        it('should write number', () => {
            expect(ds.writeNumberAsString(number)).to.does.not.throw;
        });

        it('should read number', () => {
            expect(ds.readNumberAsString()).to.equal(number);
        });

        it('should throw error with undefined', () => {
            expect(() => ds.writeNumberAsString()).to.throw(Error, "Value must be a number");
        });

        it('should throw error with string', () => {
            expect(() => ds.writeNumberAsString("123")).to.throw(Error, "Value must be a number");
        });
    });

    describe("string", () => {
        const ds = new DataStream();
        const temp = "My String";
        it('should write string', () => {
            expect(ds.writeString(temp)).to.not.throw;
        });

        it('should read string', () => {
            expect(ds.readString()).to.equal(temp);
        });

        it('should throw error with undefined', () => {
            expect(() => ds.writeString()).to.throw(Error, "Value must be a string");
        });

        it('should throw error with number', () => {
            expect(() => ds.writeString(123)).to.throw(Error, "Value must be a string");
        });
    });

    describe("boolean", () => {
        const ds = new DataStream();
        it('should write boolean - true', () => {
            expect(ds.writeBoolean(true)).to.not.throw;
        });

        it('should read booean - true', () => {
            expect(ds.readBoolean()).to.equal(true);
        });

        it('should write boolean - false', () => {
            expect(ds.writeBoolean(false)).to.not.throw;
        });

        it('should read booean - false', () => {
            expect(ds.readBoolean()).to.equal(false);
        });

        it('should throw error with undefined', () => {
            expect(() => ds.writeBoolean()).to.throw(Error, "Value must be a boolean");
        });

        it('should throw error with number', () => {
            expect(() => ds.writeBoolean(123)).to.throw(Error, "Value must be a boolean");
        });
    });

    describe("function", () => {
        const ds = new DataStream();
        it('should write function', () => {
            expect(ds.writeFunction(function () { })).to.not.throw;
            expect(ds.writeFunction(function () { })).to.not.throw;
        });

        it('should read function', () => {
            expect(ds.readFunction()).to.not.throw;
            expect(ds.readFunction()()).to.not.throw;
        });

        it('should write arrow function', () => {
            expect(ds.writeFunction(() => { })).to.not.throw;
            expect(ds.writeFunction(() => { })).to.not.throw;
        });

        it('should read arrow function', () => {
            expect(ds.readFunction()).to.not.throw;
            expect(ds.readFunction()()).to.not.throw;
        });

        it('should write function with arguments', () => {
            expect(ds.writeFunction(function (a) { })).to.not.throw;
            expect(ds.writeFunction(function (a, b) { })).to.not.throw;
            expect(ds.writeFunction(function (a, b, c) { })).to.not.throw;
        });

        it('should read function', () => {
            expect(ds.readFunction()()).to.not.throw;
            expect(ds.readFunction()()).to.not.throw;
            expect(ds.readFunction()()).to.not.throw;
        });

        it('should write arrow function with arguments', () => {
            expect(ds.writeFunction((a) => { })).to.not.throw;
            expect(ds.writeFunction((a, b) => { })).to.not.throw;
            expect(ds.writeFunction((a, b, c) => { })).to.not.throw;
        });

        it('should read arrow function', () => {
            expect(ds.readFunction()()).to.not.throw;
            expect(ds.readFunction()()).to.not.throw;
            expect(ds.readFunction()()).to.not.throw;
        });


        it('should write function with body', () => {
            expect(ds.writeFunction(function () { return 228; })).to.not.throw;
            expect(ds.writeFunction(function (a) { return a; })).to.not.throw;
            expect(ds.writeFunction(function (a, b) { return a + b; })).to.not.throw;
        });

        it('should read function with body', () => {
            expect(ds.readFunction()()).to.equal(228);
            expect(ds.readFunction()(1337)).to.equal(1337);
            expect(ds.readFunction()(2, 4)).to.equal(6);
        });

        it('should write arrow function with body', () => {
            expect(ds.writeFunction(() => { return 228; })).to.not.throw;
            expect(ds.writeFunction((a) => { return a; })).to.not.throw;
            expect(ds.writeFunction((a, b) => { return a - b; })).to.not.throw;
        });

        it('should read arrow function', () => {
            expect(ds.readFunction()()).to.equal(228);
            expect(ds.readFunction()(1338)).to.equal(1338);
            expect(ds.readFunction()(2, 4)).to.equal(-2);
        });

        it('should throw error with undefined', () => {
            expect(() => ds.writeFunction()).to.throw(Error, "Value must be a function");
        });

        it('should throw error with number', () => {
            expect(() => ds.writeFunction(123)).to.throw(Error, "Value must be a function");
        });

        it('should throw error with string', () => {
            expect(() => ds.writeFunction("")).to.throw(Error, "Value must be a function");
        });
    });

    describe("object", () => {
        const ds = new DataStream();
        const name = "Rostyslav";
        const surname = "Pidburachynskyi";
        const year = 19;
        const isMale = true;
        const func = () => {
            return `${this.surname} ${this.name} is ${this.year} old and ${this.isMale ? 'male' : 'female'}`;
        }

        it('should write object with strings', () => {
            expect(ds.writeObject({ name, surname })).to.not.throw;
        });
        it('should read object with strings', () => {
            expect(JSON.stringify(ds.readObject())).to.equal(JSON.stringify({ name, surname }));
        });

        it('should write object with number', () => {
            expect(ds.writeObject({ year })).to.not.throw;
        });

        it('should read object with number', () => {
            expect(JSON.stringify(ds.readObject())).to.equal(JSON.stringify({ year }));
        });

        it('should write object with boolean', () => {
            expect(ds.writeObject({ isMale })).to.not.throw;
        });

        it('should read object with boolean', () => {
            expect(JSON.stringify(ds.readObject())).to.equal(JSON.stringify({ isMale }));
        });

        it('should write object with function', () => {
            expect(ds.writeObject({ func })).to.not.throw;
        });

        it('should read object with function', () => {
            const obj = ds.readObject();
            expect(JSON.stringify(obj)).to.equal(JSON.stringify({ func }));
            expect(obj.func()).to.equal(func());
        });

        it("shoud write full object", () => {
            expect(ds.writeObject({ name, surname, year, func, isMale })).to.not.throw;
        });

        it("shoud write full object", () => {
            expect(JSON.stringify(ds.readObject())).to.equal(JSON.stringify({ name, surname, year, isMale, func }));
        });

        it('should throw error with undefined', () => {
            expect(() => ds.writeObject()).to.throw(Error, "Value must be a object");
        });

        it('should throw error with number', () => {
            expect(() => ds.writeObject(123)).to.throw(Error, "Value must be a object");
        });

        it('should throw error with string', () => {
            expect(() => ds.writeObject("")).to.throw(Error, "Value must be a object");
        });

        it('should throw error with null', () => {
            expect(() => ds.writeObject(null)).to.throw(Error, "Object cannot be a null");
        });
    });
});