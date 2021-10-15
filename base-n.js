/** Converts a number to BigInt. */
const _B=function(t){return BigInt(t)};
/** A static class that provides a variety of functions to encrypt/decrypt messages.
 * 
 * All methods return strings.
 */
class BaseN {
    /**
     * Encrypts a message, given a key and two charsets.
     * 
     * ```baseCharset``` must include all symbols used in both *msg* and *key*.
     * @param {string} msg
     * @param {string} key
     * @param {string} baseCharset
     * @param {string} newCharset
     */
    static encrypt(msg,key,baseCharset,newCharset){let t=msg,e=key,r=baseCharset,n=newCharset;const l=_B(r.length),s=_B(n.length);let i,c=_B(0),o="",h=[];for(let e=0;e<t.length;e++)c+=l**_B(t.length-1-e)*_B(r.indexOf(t[e]));for(let t=_B(e.length-1);t>=0;t--){const n=r.indexOf(e[Number(t)]);c+=l**t*_B(n),h.push(n)}if(c<0)return"";for(i=_B(0);s**i<=c&&s**(i+_B(1))<c;i++);for(;i>=0;i--)for(let t=_B(0);t<s;t++){const e=s**i,r=e*t;if(r<=c&&r+e>c){c-=r,o+=n[(Number(t)+h.reduce((t,e)=>t+e))%Number(s)];for(let t=0;t<h.length&&(h[t]+=1,h[t]>=l);t++)h[t]=0}}return o}
    /**
     * Decrypts a message, given a key and two charsets.
     * @param {string} msg
     * @param {string} key
     * @param {string} baseCharset
     * @param {string} newCharset
     */
    static decrypt(msg,key,baseCharset,newCharset){let t=msg,e=key,r=baseCharset,n=newCharset;const l=_B(r.length),s=_B(n.length);let i,c=_B(0),o="",h=[];for(let t=_B(e.length-1);t>=0;t--){const r=n.indexOf(e[Number(t)]);c-=s**t*_B(r),h.push(r)}for(let e=0;e<t.length;e++){let n=_B(h.reduce((t,e)=>t+e)+r.indexOf(t[e]));for(let e=2;e<l;e++)n-=_B(r.indexOf(t[e]))*l-_B(h.reduce((t,e)=>t+e));for(let t=0;t<h.length&&(h[t]+=1,h[t]>=s);t++)h[t]=0;c+=l**_B(t.length-1-e)*(n%l)}if(c<_B(0))return"";for(i=_B(0);s**i<=c&&s**(i+_B(1))<=c;i++);for(;i>=0;i--)for(let t=_B(0);t<s;t++){const e=s**i,r=e*t;r<=c&&r+e>c&&(c-=r,o+=n[Number(t)])}return o}
    /**
     * Returns all characters contained in input, without duplicates.
     * @param {string} msg
     * @returns {string}
     */
     static extractCharset(msg){let e="";for(let r=0;r<msg.length;r++)e.includes(msg[r])||(e+=msg[r]);return e}
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
     * This function extracts the charset of the message and shuffles it randomly.
     * It attempts to shuffle it in a way no substring of ```msg``` will start with the first letter of the charset (if not possible an error will be thrown).
     * If ```substringLength=0``` the input will be treated as a whole word.
     * 
     * @param {string} msg
     * @param {number} [substringLength=0] the length of a single subdivision of the string **msg**.
     */
    static extractAndRandomize(msg,substringLength){const r=0===(substringLength=void 0===substringLength?0:substringLength)?"":this.extractCharset(msg.match(new RegExp(`.{1,${substringLength}}`,"g")).map(v=>v[0]));let n=this.extractCharset(msg),l=n,s="",i=n.length;for(;n.length!==i-1;){const i=Math.floor(Math.random()*l.length);if(0===substringLength&&msg[0]===l[i]||r.includes(l[i])){l=l.slice(0,i)+l.slice(i+1);continue}if(0===l.length)throw"Impossible to create a safe charset";const c=n.indexOf(l[i]);s+=n[c],n=n.slice(0,c)+n.slice(c+1)}for(;s.length!==i;){const t=Math.floor(Math.random()*n.length);s+=n[t],n=n.slice(0,t)+n.slice(t+1)}return s}
    /**
     * works exactly like ```.encrypt()``` but treats the input as segments, given a valid ```substringLength``` value.
     * @param {string} msg
     * @param {string} key
     * @param {string} baseCharset
     * @param {string} newCharset
     * @param {number} substringLength the length of a single substring of **msg**.
     * @param {string|string[]} [inBetween=" "] a string or a serie of strings that stitches the substrings together.
     */
    static encryptSubstrings(msg,key,baseCharset,newCharset,substringLength,inBetween){let t=msg,e=key,r=baseCharset,n=newCharset,l=substringLength,s=inBetween;s=void 0===s?" ":s;let i="";if("number"!=typeof l)throw"substringLength must be a number!";for(let c=0;c<t.length;c+=l)i+=this.encrypt(t.slice(c,c+l),e,r,n),c+l<t.length&&(i+=Array.isArray(s)?s[c%s.length]:s);return i}
    /**
     * works exactly like ```.decrypt()``` but treats the input as segments.
     * @param {string} msg
     * @param {string} key
     * @param {string} baseCharset
     * @param {string} newCharset
     * @param {string|string[]} [inBetween=" "] needed to split the input into substrings.
     */
    static decryptSubstrings(msg,key,baseCharset,newCharset,inBetween){let t=msg,e=key,r=baseCharset,n=newCharset,l=inBetween;l=void 0===l?" ":l;let s=[],i="";if(Array.isArray(l)){l=[...new Set(l)];for(let e=0;e<l.length;e++)t=t.replaceAll(l[e],"{{{{{{SPLIT--POINT}}}}}}");s=t.split("{{{{{{SPLIT--POINT}}}}}}")}else s=t.split(l);for(let t=0;t<s.length;t++)i+=this.decrypt(s[t],e,r,n);return i}
}
Object.freeze(BaseN);