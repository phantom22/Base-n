# Base-n
a simple script to create custom numeric sistems and encode&amp;parse them

---

## Usage
the constructor takes two arguments:
* **numbericBase** => integer
* **baseCharacters** => string (not Array for more readable code); it will be split into an array and it decides how your numbers will be parsed.
*the class freezes after initialization, so both of these properties cannot be changed on runtime*

```js
const b = new Base(15); // in this case the character range is from "a" to "o"
b.encode(1744); // "hle"
b.parse("hle"); // 1744
```

## Using custom characters

```js
const b = new Base(2,"%$"); // you can use any character
b.encode(399); // returns "$%$$%%$$$$%", same as "110001111" in binary
b.parse("$%$$%%$$$$%"); // 399
```
*unless your base is higher than 26, you can omit the second argument (the script uses english letters as placeholder)*

---

### Enjoy!
