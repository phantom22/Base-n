
# Base-n
a simple script to encrypt and parse strings.

---

## Usage
**BaseN** is a static class with two main methods: ```encrypt``` & ```decrypt```

they both share the same arguments:
| name              |  type  | description                                                                                   | additional                   |
|:------------------|:------:|:----------------------------------------------------------------------------------------------|:-----------------------------|
| ```msg```         | string | whatever your want to encrypt                                                                 |                              |
| ```key```         | string | a key that will further secure the encryption                                                 |                              |
| ```baseCharset``` | string | string of non repeating symbols that must include all the characters used both in msg and key | its length = numerical base  |
| ```newCharset```  | string | string of non repeating symbols                                                               | its length = numerical base  |

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

## Encryption of big chuncks of data
There is another way to encode a message: ```encryptFragments``` & ```decryptFragments```

they're pretty similar to the main functions but have some extra arguments
| name                   | extra arguments            | description                                                                                     |
|:-----------------------|:--------------------------:|:------------------------------------------------------------------------------------------------|
| ```encryptFragments``` | fragmentation, inBetween   | ```fragmentation``` is the max size of the substrings, while ```inBetween``` is the character that "stitches" everything together |
| ```extractCharset```   | inBetween                  | in this case ```inBetween``` is needed to split ```msg``` and get an array of strings to decode |
```js
const longString = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit, enim et tempus cursus, magna nisi ullamcorper ipsum, vitae facilisis elit neque sed justo. Cras laoreet, erat non dignissim interdum, sapien mi sagittis ante, in sagittis nulla ligula sit amet augue. Morbi laoreet urna at enim venenatis, id lobortis purus ornare. Sed ut magna eget dui dignissim aliquet molestie ac elit. Sed volutpat vulputate ipsum ac interdum. Fusce dignissim, turpis sit amet feugiat egestas, turpis enim hendrerit justo, non congue ex orci sit amet sem. Cras venenatis augue posuere suscipit commodo. Donec vel sagittis ante. Aenean lacinia tortor eget magna malesuada, vitae ultricies lacus ultricies. Nullam bibendum urna eget justo dignissim, sed rutrum dolor aliquet. Suspendisse feugiat tortor eget tempor euismod. Mauris convallis laoreet tortor at tristique. Maecenas eleifend fringilla mi. Nam eu mauris cursus magna lobortis accumsan.`;

const key = "Random key";

const charset = BaseN.extractAndShuffle(longString + key, 10);
// output: "h MkCiuvmolegAtLDbscFaprRqfSdxj.yn,N"

const encrypted = BaseN.encryptFragments(longString, key, charset, "012345")
// output: "343230505253133332035 332111453315402502024 342110352320321502132 313304511355050053520 304543514220105045445 10133344251024502224 305155041135021433534 305154234145021030220 345322102325302052020 351100510230121551352 341030342004054035135 344240352445403321054 10035305124210445013 342434541551405031424 350155041325433105212 340513005140143425215 330304254043132343455 10125242414532104315 345450302153441515203 335312355430033005124 313324520014140525255 353443500003240035255 353203502354053503412 342202441233335253445 335324255433221041433 353114455334142315255 335322113255055503335 340104531144341342524 10125242414532054024 300030341405235145324 332113100005021311224 351042150013242122532 305323510141434330155 10115422350532344151 340542150353240311112 353114500325235420024 11422450553543135420 10313344433032054020 333244510354042503450 10133344251024300552 10153243125251200115 331104414230301101520 335445050253201255124 313324520014140455251 330305105152433155324 350303553113250053053 335302110225235310234 342110205235033311220 345204510351454525241 330450455433243510531 10543423500532225530 11442505244310454221 313115154005034135134 315114325444535240041 10312154242143020205 10025402322134034223 313434255433201041035 345110453434143331520 350105011221433105250 333223254015414502432 313255141245041502152 340154202220035325441 340012101333443325320 344435150004000551232 305324325145044131220 332434033403240311434 350100324513435050041 353252150310303042124 345302154400134245135 344320555444043254120 325104454404235230044 340031450253134345452 10133554242103541030 333111455343333252024 333042110332435330141 305103242015442123520 353243521235050455202 330300400112433252034 11403445223550054130 333454253523243141041 10203441404351440424 335303254022135013335 305155041445421003333 344155041311441331534 342114253520341335252 342114225220150043135 340012142405005145452 350114554324010145403 11405445554522010441 10102420042550554023 330113213231533245250 330455050433240311112 353114453425403100055 10314000124243214305"

const decrypted = BaseN.decryptFragments(encrypted, key, "012345", charset);

decrypted === longString // true
```
## Bonus
There are two other methods:
| name                    | arguments              | description                                                                                   |
|:------------------------|:----------------------:|:----------------------------------------------------------------------------------------------|
| ```extractAndShuffle``` | charset, fragmentation | safely reorders a charset, useful to create a unique charset order for encryption             |
| ```extractCharset```    | string                 | given an input, this function will return a string of all the characters ignoring duplicates  |
```js
BaseN.extractAndShuffle("abcdefg0123456");
// output: "5fga6c2d3b140e"

BaseN.extractAndShuffle("abcdefghij", 2);
/* the string is split in pairs of 2 characters:
 *	["ab","cd","ef","gh","ij"]
 * then the scripts checks each first letter:
 *	["a","c","e","g","i"]
 * and makes sure that the first letter of the output isn't any of these
 * output: "dblcgfaeih"
 */
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
 * BaseN.extractAndShuffle always makes sure that there won't be a situation like this!
 */
```

### Have fun!
