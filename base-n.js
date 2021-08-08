/**
 * Converts a number to BigInt.
 */
 function B(e){return BigInt(e)}
 /**
  * A static class that provides a variety of functions to encrypt/decrypt messages.
  */
 class BaseN{
    /**
     * Encrypts a string, given a key and two charsets.
     * 
     * ```oldCharset``` must include all symbols used in both *msg* and *key*.
     * @param {string} msg 
     * @param {string} key 
     * @param {string} oldCharset 
     * @param {string} newCharset
     * @returns {string}
     */
    static encrypt(msg,key,oldCharset,newCharset){const l=B(oldCharset.length),s=B(newCharset.length);let c,o=B(0),f="",h=[];for(let key=0;key<msg.length;key++)o+=l**B(msg.length-1-key)*B(oldCharset.indexOf(msg[key]));for(let msg=B(key.length-1);msg>=0;msg--){const newCharset=oldCharset.indexOf(key[Number(msg)]);o+=l**msg*B(newCharset),h.push(newCharset)}if(o<0)return"";for(c=B(0);s**c<=o&&s**(c+B(1))<o;c++);for(;c>=0;c--)for(let msg=B(0);msg<s;msg++){const key=s**c,oldCharset=key*msg;if(oldCharset<=o&&oldCharset+key>o){o-=oldCharset,f+=newCharset[(Number(msg)+h.reduce((msg,key)=>msg+key))%Number(s)];for(let msg=0;msg<h.length&&(h[msg]+=1,h[msg]>=l);msg++)h[msg]=0}}return f}
    /**
     * Decrypts a string, given a key and two charsets.
     * @param {string} msg 
     * @param {string} key 
     * @param {string} oldCharset 
     * @param {string} newCharset 
     * @returns {string}
     */
    static decrypt(msg,key,oldCharset,newCharset){const l=B(oldCharset.length),s=B(newCharset.length);let c,o=B(0),f="",h=[];for(let msg=B(key.length-1);msg>=0;msg--){const oldCharset=newCharset.indexOf(key[Number(msg)]);o-=s**msg*B(oldCharset),h.push(oldCharset)}for(let key=0;key<msg.length;key++){let newCharset=B(h.reduce((msg,key)=>msg+key)+oldCharset.indexOf(msg[key]));for(let key=2;key<l;key++)newCharset-=B(oldCharset.indexOf(msg[key]))*l-B(h.reduce((msg,key)=>msg+key));for(let msg=0;msg<h.length&&(h[msg]+=1,h[msg]>=s);msg++)h[msg]=0;o+=l**B(msg.length-1-key)*(newCharset%l)}if(o<B(0))return"";for(c=B(0);s**c<=o&&s**(c+B(1))<=o;c++);for(;c>=0;c--)for(let msg=B(0);msg<s;msg++){const key=s**c,oldCharset=key*msg;oldCharset<=o&&oldCharset+key>o&&(o-=oldCharset,f+=newCharset[Number(msg)])}return f}
    /**
     * Returns all characters contained in ```msg``` without duplicates.
     * @param {string} msg
     * @returns {string}
     */
    static extractCharset(msg){let t="";for(let r=0;r<msg.length;r++)t.includes(msg[r])||(t+=msg[r]);return t}
    /**
     * This function extracts the charset of ```msg``` and shuffles it randomly.
     * It attempts to shuffle it in a way no fragment of ```msg``` will start with the first letter of the charset.
     * If ```fragmentation``` is equal to ```0``` then the input will be treated as a whole word.
     * 
     * If a safe shuffle is impossible an error will be thrown.
     * @param {string} msg
     * @param {number} [fragmentation=0] the length of a single subdivision of the string **msg**.
     * @returns {string}
     */
    static extractAndshuffle(msg,fragmentation){const r=0===(fragmentation=void 0===fragmentation?0:fragmentation)?"":BaseN.extractCharset(msg.match(new RegExp(`.{1,${fragmentation}}`,"g")).map(msg=>msg[0]));let n=BaseN.extractCharset(msg),l=n,s="",c=n.length;for(;n.length!==c-1;){const c=Math.floor(Math.random()*l.length);if(0===fragmentation&&msg[0]===l[c]||r.includes(l[c])){l=l.slice(0,c)+l.slice(c+1);continue}if(0===l.length)throw"Impossible to create a safe shuffle";const o=n.indexOf(l[c]);s+=n[o],n=n.slice(0,o)+n.slice(o+1)}for(;s.length!==c;){const msg=Math.floor(Math.random()*n.length);s+=n[msg],n=n.slice(0,msg)+n.slice(msg+1)}return s}
    /**
     * works exactly like ```.encrypt()``` but treats the input as fragments.
     * @param {string} msg 
     * @param {string} key 
     * @param {string} oldCharset 
     * @param {string} newCharset 
     * @param {number} fragmentation the length of a single subdivision of the string **msg**.
     * @param {string} [inBetween=" "] the character that stitches the fragments together.
     * @returns {string}
     */
    static encryptFragments(msg,key,oldCharset,newCharset,fragmentation,inBetween){inBetween=void 0===inBetween?" ":inBetween;let c="";for(let o=0;o<msg.length;o+=fragmentation)c+=BaseN.encrypt(msg.slice(o,o+fragmentation),key,oldCharset,newCharset),o+fragmentation<msg.length&&(c+=inBetween);return c}
    /**
     * works exactly like ```.decrypt()``` but treats the input as fragments.
     * @param {string} msg 
     * @param {string} key 
     * @param {string} oldCharset 
     * @param {string} newCharset 
     * @param {string} [inBetween=" "] needed to split the input in fragments.
     * @returns {string}
     */
    static decryptFragments(msg,key,oldCharset,newCharset,inBetween){inBetween=void 0===inBetween?" ":inBetween;let s="";const c=msg.split(inBetween);for(let msg=0;msg<c.length;msg++)s+=BaseN.decrypt(c[msg],key,oldCharset,newCharset);return s}
 }
 Object.freeze(BaseN);