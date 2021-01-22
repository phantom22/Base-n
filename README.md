# Base-n
a simple script to create custom numeral systems and encode&amp;parse them.

---

## Usage
the constructor takes two arguments:
* **numbericBase** => integer
* **baseCharacters** => string (not Array for more readable code); it will be split into an array and it decides how your numbers will be parsed.

```js
const b = new Base(16); // in this case the character range is from "0" to "f"
b.Int.encode(1744); // "6d0"
b.Int.parse("6d0"); // 1744
```

## High precision encoding
```js
const b = new Base(36), // in this case the character range is from "0" to "z"
      superBigNumber = 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890n,
      encoded = b.BigInt.encode(superBigNumber); // "6d0"

b.BigInt.parse(encoded) === superBigNumber // true
```

**note that this function doesn't convert negative numbers to positive, so be careful. Also, the number passed as argument must be a BigInt!**

## Using custom sets of characters

```js
const b = new Base(2,"%$"); // you can use any character
b.Int.encode(399); // returns "$$%%%$$$$", same as "110001111" in binary
b.Int.parse("$$%%%$$$$"); // 399
```
*unless your base is higher than 128, you can omit the second argument (the script firstly uses a wide range of placeholder symbols)*

---

**IMPORTANT**: this script is supposed to work only with positive integers, every other variation won't give the expected result!

### Have fun!
