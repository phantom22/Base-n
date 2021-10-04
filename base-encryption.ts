/** Converts a number to BigInt. */
const _B = function(value: number) {
    return BigInt(value)
}

/** A static class that provides a variety of functions to encrypt/decrypt messages.
 * 
 * All methods return strings.
 */
class BaseN {
    /**
     * Encrypts a message, given a key and two charsets.
     * 
     * ```baseCharset``` must include all symbols used in both *msg* and *key*.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     */
    static encrypt(settings: {msg: string, key: string, baseCharset: string, newCharset: string}) {
        const { msg, key, baseCharset, newCharset } = settings,
              OldBase = _B(baseCharset.length),
              NewBase = _B(newCharset.length);
        let RelativeNumber = _B(0),
            NewMagnitude: bigint,
            EncryptedMsg = "",
            rotors = <number[]>[];

        // 1. calc relative msg number and key number, calculated in reverse: "531" would be read as 135
        for (let i = 0; i < msg.length; i++) {
            RelativeNumber += OldBase ** _B(msg.length - 1 - i) * _B(baseCharset.indexOf(msg[i]));
        }
        for (let i = _B(key.length - 1); i >= 0; i--) {
            const index = baseCharset.indexOf(key[Number(i)]);
            RelativeNumber += OldBase ** i * _B(index);
            rotors.push(index);
        }

        if (RelativeNumber < 0) {
            return ""
        }
        // 2. now calc the max magnitude of the relative number in the new base
        for (NewMagnitude = _B(0); NewBase ** NewMagnitude <= RelativeNumber && NewBase ** (NewMagnitude + _B(1)) < RelativeNumber; NewMagnitude++) {};

        // 3. encrypt msg by subtracting from the relative number, starting from the highest magnitude:
        for (NewMagnitude; NewMagnitude >= 0; NewMagnitude--) {
            for (let characterStep = _B(0); characterStep < NewBase; characterStep++) {
                const magnitudeStep = NewBase ** NewMagnitude;
                const step = magnitudeStep * characterStep;
                if (step <= RelativeNumber && step + magnitudeStep > RelativeNumber) {
                    const character = (Number(characterStep) + rotors.reduce((a,b)=>a+b)) % Number(NewBase);
                    RelativeNumber -= step;
                    EncryptedMsg += newCharset[character];
                    // rotor logic
                    for (let i = 0; i < rotors.length; i++) {
                        rotors[i] += 1;
                        if (rotors[i] >= OldBase) {
                            rotors[i] = 0;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        return EncryptedMsg;
    }
    /**
     * Decrypts a message, given a key and two charsets.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     */
    static decrypt(settings: {msg: string, key: string, baseCharset: string, newCharset: string}) {
        const { msg, key, baseCharset, newCharset } = settings,
              OldBase = _B(baseCharset.length),
              NewBase = _B(newCharset.length);
        let RelativeNumber = _B(0),
            NewMagnitude: bigint,
            DecryptedMsg = "",
            rotors = <number[]>[];
        // 1. calc relative key number (calculated in reverse: "531" would be read as 135)
        for (let i = _B(key.length - 1); i >= 0; i--) {
            const index = newCharset.indexOf(key[Number(i)]);
            RelativeNumber -= NewBase ** i * _B(index);
            rotors.push(index);
        }
        // 2. find newMsg, by applying inverse rotor logic
        for (let i = 0; i < msg.length; i++) {
            let relativeIndex = _B(rotors.reduce((a,b)=>a+b) + baseCharset.indexOf(msg[i]));
            for (let i = 2; i < OldBase; i++) {
                relativeIndex -= _B(baseCharset.indexOf(msg[i])) * OldBase - _B(rotors.reduce((a,b)=>a+b))
            }
            // rotor logic
            for (let i = 0; i < rotors.length; i++) {
                rotors[i] += 1;
                if (rotors[i] >= NewBase) {
                    rotors[i] = 0;
                }
                else {
                    break;
                }
            }
            // 3. calc relative newMsg number
            RelativeNumber += OldBase ** _B(msg.length - 1 - i) * (relativeIndex % OldBase);
        }

        if (RelativeNumber < _B(0)) {
            return ""
        }

        // 4. now calc the max magnitude of the relative number in the new base
        for (NewMagnitude = _B(0); NewBase ** NewMagnitude <= RelativeNumber && NewBase ** (NewMagnitude + _B(1)) <= RelativeNumber; NewMagnitude++) {};

        // 5. decrypt newMsg by subtracting from the relative number, starting from the highest magnitude
        for (NewMagnitude; NewMagnitude >= 0; NewMagnitude--) {
            for (let characterStep = _B(0); characterStep < NewBase; characterStep++) {
                const magnitudeStep = NewBase ** NewMagnitude;
                const step = magnitudeStep * characterStep;
                if (step <= RelativeNumber && step + magnitudeStep > RelativeNumber) {
                    RelativeNumber -= step;
                    DecryptedMsg += newCharset[Number(characterStep)];
                }
            }
        }
        return DecryptedMsg;
    }
    /**
     * Returns a safe charset for both the msg and the key.
     * 
     * ```substringLength``` affects only the ```msg```.
     * @param {string} msg
     * @param {string} key
     * @param {number} [substringLength=0]
     */
    static charsetFromMsgAndKey(msg: string, key: string, substringLength?: number) {
        return this.extractCharset(this.extractAndRandomize(msg, substringLength) + this.extractAndRandomize(key));
    }
    /**
     * Returns all characters contained in input, without duplicates.
     * @param {string} msg
     * @returns {string}
     */
    static extractCharset(msg: string | string[]) {
        let result = "";
        for (let i = 0; i < msg.length; i++) {
            if (result.includes(msg[i])) continue;
            result += msg[i];
        }
        return result;
    }
    /**
     * This function extracts the charset of the message and shuffles it randomly.
     * It attempts to shuffle it in a way no substring of ```msg``` will start with the first letter of the charset (if not possible an error will be thrown).
     * If ```substringLength=0``` the input will be treated as a whole word.
     * 
     * @param {string} msg
     * @param {number} [substringLength=0] the length of a single subdivision of the string **msg**.
     */
    static extractAndRandomize(msg: string, substringLength?: number) {
        substringLength = typeof substringLength === "undefined" ? 0 : substringLength;
        const firstLetters: string = substringLength === 0 ? "" : this.extractCharset(msg.match(new RegExp(`.{1,${substringLength}}`,'g')).map(v => v[0]));
        let charset = this.extractCharset(msg), testCharset = charset, result = "", maxIterations = charset.length;
        while (charset.length !== maxIterations - 1) {
            const r = Math.floor(Math.random() * testCharset.length);
            if (substringLength === 0 && msg[0] === testCharset[r] || firstLetters.includes(testCharset[r])) {
                testCharset = testCharset.slice(0, r) + testCharset.slice(r + 1);
                continue;
            }
            else if (testCharset.length === 0) {
                throw "Impossible to create a safe charset";
            }
            const index = charset.indexOf(testCharset[r]);
            result += charset[index];
            charset = charset.slice(0, index) + charset.slice(index + 1);
        }
        while (result.length !== maxIterations) {
            const r = Math.floor(Math.random() * charset.length);
            result += charset[r];
            charset = charset.slice(0,r) + charset.slice(r + 1);
        }
        return result;
    }
    /**
     * works exactly like ```.encrypt()``` but treats the input as segments, given a valid ```substringLength``` value.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     * @param {number} settings.substringLength the length of a single substring of **msg**.
     * @param {string|string[]} [settings.inBetween=" "] a string or a serie of strings that stitches the substrings together.
     */
    static encryptSubstrings(settings: {msg: string, key: string, baseCharset: string, newCharset: string, substringLength: number, inBetween?: string | string[]}) {
        const { msg, key, baseCharset, newCharset, substringLength } = settings,
                inBetween = typeof settings.inBetween === "undefined" ? " " : settings.inBetween;
        let result = "";
        if (typeof substringLength !== "number") {
            throw "substringLength must be a number!";
        }
        for (let i = 0; i < msg.length; i+=substringLength) {
            result += this.encrypt({msg: msg.slice(i, i+substringLength), key, baseCharset, newCharset});
            if (i+substringLength < msg.length) {
                result += Array.isArray(inBetween) ? inBetween[i % inBetween.length] : inBetween;
            }
        }
        return result
    }
    /**
     * works exactly like ```.decrypt()``` but treats the input as segments.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     * @param {string|string[]} [settings.inBetween=" "] needed to split the input into substrings.
     */
    static decryptSubstrings(settings: {msg: string, key: string, baseCharset: string, newCharset: string, inBetween?: string | string[]}) {
        const placeholder = "{{{{{{SPLIT--POINT}}}}}}",
            { key, baseCharset, newCharset } = settings;
        let msg = settings.msg, inBetween = typeof settings.inBetween === "undefined" ? " " : settings.inBetween, cuts = <string[]>[], result = "";
        if (Array.isArray(inBetween)) {
            inBetween = [...new Set(inBetween)];
            for (let i = 0; i < inBetween.length; i++) {
                msg = msg.replaceAll(inBetween[i],placeholder);
            }
            cuts = msg.split(placeholder);
        }
        else { cuts = msg.split(inBetween) }
        for (let i = 0; i < cuts.length; i++) {
            result += this.decrypt({ msg: cuts[i], key, baseCharset, newCharset });
        }
        return result
    }
}
Object.freeze(BaseN);