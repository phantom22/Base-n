/** Converts a number to BigInt. */
const _B=function(e){return BigInt(e)};
/** A static class that provides a variety of functions to encrypt/decrypt messages.
 *
 * All methods return strings.
 */
class BaseN{
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
    static encrypt(settings){const{msg:t,key:r,baseCharset:n,newCharset:s}=settings,l=_B(n.length),a=_B(s.length);let h=_B(0),i,c="",o=[];for(let e=0;e<t.length;e++)h+=l**_B(t.length-1-e)*_B(n.indexOf(t[e]));for(let e=_B(r.length-1);e>=0;e--){const t=n.indexOf(r[Number(e)]);h+=l**e*_B(t),o.push(t)}if(h<0)return"";for(i=_B(0);a**i<=h&&a**(i+_B(1))<h;i++);for(;i>=0;i--)for(let e=_B(0);e<a;e++){const t=a**i,r=t*e;if(r<=h&&r+t>h){const t=(Number(e)+o.reduce((e,t)=>e+t))%Number(a);h-=r,c+=s[t];for(let e=0;e<o.length&&(o[e]+=1,o[e]>=l);e++)o[e]=0}}return c}
    /**
     * Decrypts a message, given a key and two charsets.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     */
    static decrypt(settings){const{msg:t,key:r,baseCharset:n,newCharset:s}=settings,l=_B(n.length),a=_B(s.length);let h=_B(0),i,c="",o=[];for(let e=_B(r.length-1);e>=0;e--){const t=s.indexOf(r[Number(e)]);h-=a**e*_B(t),o.push(t)}for(let e=0;e<t.length;e++){let r=_B(o.reduce((e,t)=>e+t)+n.indexOf(t[e]));for(let e=2;e<l;e++)r-=_B(n.indexOf(t[e]))*l-_B(o.reduce((e,t)=>e+t));for(let e=0;e<o.length&&(o[e]+=1,o[e]>=a);e++)o[e]=0;h+=l**_B(t.length-1-e)*(r%l)}if(h<_B(0))return"";for(i=_B(0);a**i<=h&&a**(i+_B(1))<=h;i++);for(;i>=0;i--)for(let e=_B(0);e<a;e++){const t=a**i,r=t*e;r<=h&&r+t>h&&(h-=r,c+=s[Number(e)])}return c}
    /**
     * Returns a safe charset for both the msg and the key.
     *
     * ```substringLength``` affects only the ```msg```.
     * @param {string} msg
     * @param {string} key
     * @param {number} [substringLength=0]
     */
    static charsetFromMsgAndKey(msg,key,substringLength){return this.extractCharset(this.extractAndRandomize(msg,substringLength)+this.extractAndRandomize(key))}
    /**
     * Returns all characters contained in input, without duplicates.
     * @param {string} input
     * @returns {string}
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
    static extractAndRandomize(msg,substringLength){const r=0===(substringLength=void 0===substringLength?0:substringLength)?"":this.extractCharset(msg.match(new RegExp(`.{1,${substringLength}}`,"g")).map(e=>e[0]));let n=this.extractCharset(msg),s=n,l="",a=n.length;for(;n.length!==a-1;){const a=Math.floor(Math.random()*s.length);if(0===substringLength&&msg[0]===s[a]||r.includes(s[a])){s=s.slice(0,a)+s.slice(a+1);continue}if(0===s.length)throw"Impossible to create a safe charset";const h=n.indexOf(s[a]);l+=n[h],n=n.slice(0,h)+n.slice(h+1)}for(;l.length!==a;){const e=Math.floor(Math.random()*n.length);l+=n[e],n=n.slice(0,e)+n.slice(e+1)}return l}
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
    static encryptSubstrings(settings){const{msg:t,key:r,baseCharset:n,newCharset:s,substringLength:l}=settings,a=void 0===settings.inBetween?" ":settings.inBetween;let h="";if("number"!=typeof l)throw"substringLength must be a number!";for(let e=0;e<t.length;e+=l)h+=this.encrypt({msg:t.slice(e,e+l),key:r,baseCharset:n,newCharset:s}),e+l<t.length&&(h+=Array.isArray(a)?a[e%a.length]:a);return h}
    /**
     * works exactly like ```.decrypt()``` but treats the input as segments.
     * @param {Object} settings
     * @param {string} settings.msg
     * @param {string} settings.key
     * @param {string} settings.baseCharset
     * @param {string} settings.newCharset
     * @param {string|string[]} [settings.inBetween=" "] needed to split the input into substrings.
     */
    static decryptSubstrings(settings){const t="{{{{{{SPLIT--POINT}}}}}}",{key:r,baseCharset:n,newCharset:s}=settings;let a=settings.msg,h="",i=[],l=void 0===settings.inBetween?" ":settings.inBetween;if(Array.isArray(l)){l=[...new Set(l)];for(let e=0;e<l.length;e++)a=a.replaceAll(l[e],t);i=a.split(t)}else i=a.split(l);for(let e=0;e<i.length;e++)h+=this.decrypt({msg:i[e],key:r,baseCharset:n,newCharset:s});return h}
}
Object.freeze(BaseN);