class Base {

    constructor(a, b) {
        let t = this;
        if (2 > a) throw `Base cannot be less than 2!`;
        const BASE = Math.floor(a),
            BASE_CHARS = (typeof b != "undefined" || 128 < a ? b : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрсиуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСИУФХЦЧШЩЪЫЬЗЮЯ").slice(0, a).split("")

        let B = (n) => BigInt(B);
        let getStepInt = (magnitude, step) => {
            return BASE ** magnitude * step
        }
        let estimateInt = (number) => {
            for (var magnitude = 0; 200 > magnitude && !(getStepInt(magnitude + 1, 1) > number); magnitude++);
            return magnitude
        }
        let getStepBigInt = (magnitude, step) => (B(t.BASE) ** B(magnitude) * B(step));
        let estimateBigInt = (number) => {
            for (var magnitude = 0; 200 > magnitude && !(getStepBigInt(magnitude + 1, 1) > number); magnitude++);
            return magnitude
        }

        t.Int = {};
        t.BigInt = {};

        t.Int.parse = (int) => {
            for (var result = 0, digitIndex = 0; digitIndex < int.length; digitIndex++) result += BASE ** (int.length - 1 - digitIndex) * BASE_CHARS.indexOf(int[digitIndex]);
            return result;
        }

        t.Int.encode = (int) => {
            int = Math.abs(int);

            if (int > Number.MAX_SAFE_INTEGER) console.warn("The specified number exceed the max safe integer, use BigInt to prevent data loss!");

            for (var result = "", magnitude = estimateInt(int); - 1 < magnitude; magnitude--)
                for (let step = 0; step < BASE_CHARS.length; step++) {
                    let currentStep = getStepInt(magnitude, step);
                    if (currentStep == int || getStepInt(magnitude, step + 1) > int) {
                        int -= currentStep;
                        result += BASE_CHARS[step];
                        break
                    }
                }
            return result
        }

        t.BigInt.parse = (bigInt) => {
            for (var result = B(0), digitIndex = B(0); digitIndex < bigInt.length; digitIndex++) result += B(BASE) ** (B(bigInt.length) - B(1) - digitIndex) * B(BASE_CHARS.indexOf(bigInt[digitIndex]));
            return result
        }

        t.BigInt.encode = (bigInt) => {
            for (var result = "", magnitude = estimateBigInt(bigInt); - 1 < magnitude; magnitude--)
                for (let step = 0; step < BASE_CHARS.length; step++) {
                    let currentStep = getStepBigInt(magnitude, step);
                    if (getStepBigInt(magnitude, step + 1) > bigInt || currentStep == bigInt) {
                        bigInt -= currentStep;
                        result += BASE_CHARS[step];
                        break
                    }
                }
            return result
        }

    }

}