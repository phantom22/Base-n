# Base-n
a simple script to create custom numeral systems and encode&amp;parse them.

---

## Usage
**BaseN** is a static class with two methods: ```encrypt``` & ```decrypt```

they both share the same arguments:
| name              |  type  | description                                                                                   | additional                   |
|:------------------|:------:|:----------------------------------------------------------------------------------------------|:-----------------------------|
| ```msg```         | string | whatever your want to encrypt                                                                 |                              |
| ```key```         | string | a key that will further secure the encryption                                                 |                              |
| ```baseCharset``` | string | string of non repeating symbols that must include all the characters used both in msg and key | its length = numerical base |
| ```newCharset```  | string | string of non repeating symbols                                                               | its length = numerical base |

```js
// instead of "sukymeo gra" any other arrangement would work, for ex. " aegkmorsuy" BUT with a different output!!
BaseN.encrypt("your message", "key", "sukymeo gra", "01");
/*  encoding a message from base15 to base2
 *  "sukymeo gra".length: 15
 *  "01".length: 2
 *  output: "1011100111011000100111011010110010001011"
 */

BaseN.decrypt("1011100111011000100111011010110010001011","key","01","sukymeo gra");
/*  same logic applies here: parsing from base2 to base15
 *  output: "your message"
 */
```



## High precision but to an extent
Web browsers are pretty limited on the amount of data that they can store in a single integer, therefore math operations between very large numbers may be inprecise: so keep in mind that bigger messages, keys or charsets may introduce unexpected results!

```If either BaseN.encrypt or BaseN.decrypt returns an empty string, generally it's the keys fault in combination with the message (you should shorten/change either your message, your key or the charsets)!!!```

## Using custom sets of characters
Keep in mind that ```baseCharset``` & ```newCharset``` have the same function as "0123456789" in the decimal numerical system: enumerating, from lowest to highest, the numerical value of a symbol, but you can easily mix things up (for ex. "9302756184") and it would be very difficult to brute force a value without knowing both the charsets symbol order.

## Bonus
There are two other methods:
| name                 | arguments    | description                                                                                   |
|:---------------------|:------------:|:----------------------------------------------------------------------------------------------|
| ```shuffle```        | charset      | randomly reorders a charset, useful to create a unique charset order for encryption           |
| ```extractCharset``` | string       | given an input, this function will return a string of all the characters ignoring duplicates  |
```js
BaseN.shuffle("abcdefg0123456");
// output: "5fga6c2d3b140e"

let testCharset = BaseN.extractCharset("ababcdcdefefghghijijklklmnmn");
// output: "abcdefghijklmn"
// note that the order of the characters completely depends from the order of apparition of the symbols in the input string

testCharset = BaseN.shuffle(testCharset);
// result: "mdanighfjbkelc"
```
---

**Common situtation**
```js
const baseCharset = "abcdefghijklmnopqrstuvwxyz";
BaseN.encrypt("arc","key",baseCharset,"0123");
// output: "33313222"

BaseN.decrypt("33313222","key","0123",baseCharset);
/* output: "rc"
 *
 * But why?
 * "a" from "arc" is the same as writing a "0" before a number, because in our baseCharset it's actually the first symbol
 * therefore during the encryption fase it will be discarded
 */
```

### Have fun!
