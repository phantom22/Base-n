/** Converts a number to BigInt. */
const _B=function(e){return BigInt(e)};
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
    static encrypt(settings){const{msg:t,key:r,baseCharset:n,newCharset:s}=settings,a=_B(n.length),h=_B(s.length);let i=_B(0),l,c="",o=[];for(let e=0;e<t.length;e++)i+=a**_B(t.length-1-e)*_B(n.indexOf(t[e]));for(let e=_B(r.length-1);e>=0;e--){const t=n.indexOf(r[Number(e)]);i+=a**e*_B(t),o.push(t)}if(i<0)return"";for(l=_B(0);h**l<=i&&h**(l+_B(1))<i;l++);for(;l>=0;l--)for(let e=_B(0);e<h;e++){const t=h**l,r=t*e;if(r<=i&&r+t>i){const t=(Number(e)+o.reduce((e,t)=>e+t))%Number(h);i-=r,c+=s[t];for(let e=0;e<o.length&&(o[e]+=1,o[e]>=a);e++)o[e]=0}}return c}
    /**
     * Decrypts a message, given a key and two charsets.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     */
    static decrypt(settings){const{msg:t,key:r,baseCharset:n,newCharset:s}=settings,a=_B(n.length),h=_B(s.length);let i=_B(0),l,c="",o=[];for(let e=_B(r.length-1);e>=0;e--){const t=s.indexOf(r[Number(e)]);i-=h**e*_B(t),o.push(t)}for(let e=0;e<t.length;e++){let r=_B(o.reduce((e,t)=>e+t)+n.indexOf(t[e]));for(let e=2;e<a;e++)r-=_B(n.indexOf(t[e]))*a-_B(o.reduce((e,t)=>e+t));for(let e=0;e<o.length&&(o[e]+=1,o[e]>=h);e++)o[e]=0;i+=a**_B(t.length-1-e)*(r%a)}if(i<_B(0))return"";for(l=_B(0);h**l<=i&&h**(l+_B(1))<=i;l++);for(;l>=0;l--)for(let e=_B(0);e<h;e++){const t=h**l,r=t*e;r<=i&&r+t>i&&(i-=r,c+=s[Number(e)])}return c}
    /**
     * Returns a safe charset for both the msg and the key.
     * 
     * ```substringLength``` affects only the ```msg```.
     * @param {string} msg
     * @param {string} key
     * @param {number} [substringLength=0]
     */
    static charsetFromMsgAndKey(msg,key,substringLength){return this.extractCharset(this.extractAndRandomize(msg,substringLength)+this.extractCharset(key))}
    /**
     * Returns all characters contained in input, without duplicates.
     * @param {string} input
     */
    static extractCharset(input){let t="";for(let r=0;r<input.length;r++)t.includes(input[r])||(t+=input[r]);return t}
    /**
     * This function extracts the charset of the message and shuffles it randomly.
     * It attempts to shuffle it in a way no substring of ```msg``` will start with the first letter of the charset (if not possible an error will be thrown).
     * If ```substringLength=0``` the input will be treated as a whole word.
     * 
     * @param {string} msg
     * @param {number} [substringLength=0] the length of a single subdivision of the string **msg**.
     */
    static extractAndRandomize(msg,substringLength){const r=0===(substringLength=void 0===substringLength?0:substringLength)?"":this.extractCharset(msg.match(new RegExp(`.{1,${substringLength}}`,"g")).map(e=>e[0]));let n=this.extractCharset(msg),s=n,a="",h=n.length;for(;n.length!==h-1;){const h=Math.floor(Math.random()*s.length);if(0===substringLength&&msg[0]===s[h]||r.includes(s[h])){s=s.slice(0,h)+s.slice(h+1);continue}if(0===s.length)throw"Impossible to create a safe charset";const i=n.indexOf(s[h]);a+=n[i],n=n.slice(0,i)+n.slice(i+1)}for(;a.length!==h;){const e=Math.floor(Math.random()*n.length);a+=n[e],n=n.slice(0,e)+n.slice(e+1)}return a}
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
    static encryptSubstrings(settings){const{msg:t,key:r,baseCharset:n,newCharset:s,substringLength:a}=settings,h=void 0===settings.inBetween?" ":settings.inBetween;let i="";if("number"!=typeof a)throw"substringLength must be a number!";for(let e=0;e<t.length;e+=a)i+=this.encrypt({msg:t.slice(e,e+a),key:r,baseCharset:n,newCharset:s}),e+a<t.length&&(i+=Array.isArray(h)?h[e%h.length]:h);return i}
    /**
     * works exactly like ```.decrypt()``` but treats the input as segments.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     * @param {string|string[]} [settings.inBetween=" "] needed to split the input into substrings.
     */
    static decryptSubstrings(settings){const{msg:t,key:r,baseCharset:n,newCharset:s}=settings,a=void 0===settings.inBetween?" ":settings.inBetween;let h="";const i=Array.isArray(a)?t.split(new RegExp(`\\${[...new Set(a)].join("|\\")}`)):t.split(a);for(let e=0;e<i.length;e++)h+=this.decrypt({msg:i[e],key:r,baseCharset:n,newCharset:s});return h}
}
Object.freeze(BaseN);
