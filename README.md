# Base-n
a simple script to create custom numeral systems and encode&amp;parse them.

---

## Usage
the constructor takes two arguments:
* **numbericBase** => integer
* **baseCharacters** => string (not Array for more readable code); it will be split into an array and it decides how your numbers will be parsed.
*the class freezes after initialization, so both of these properties cannot be changed on runtime*

```js
const b = new Base(16); // in this case the character range is from "0" to "F"
b.encode(1744); // "6D0"
b.parse("6D0"); // 1744
```

## Using custom sets of characters

```js
const b = new Base(2,"%$"); // you can use any character
b.encode(399); // returns "$$%%%$$$$", same as "110001111" in binary
b.parse("$$%%%$$$$"); // 399
```
*unless your base is higher than 36, you can omit the second argument (the script firstly uses numbers, then uppercase english letters as placeholder), overall range is from "0" to "Z"*

---

**IMPORTANT**: this script isn't supposed to work with negative and float numbers, so it will automatically convert them.

### Have fun!
