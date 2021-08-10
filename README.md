# Base-n
a simple script to encrypt and parse strings.

---

## Usage
**BaseN** is a static class with two main methods: ```encrypt``` & ```decrypt```

they both share the same arguments (stored in an object):
| name              |  type  | description                                                                                   | additional                   |
|:------------------|:------:|:----------------------------------------------------------------------------------------------|:-----------------------------|
| ```msg```         | string | whatever your want to encrypt                                                                 |                              |
| ```key```         | string | a key that will further secure the encryption                                                 |                              |
| ```baseCharset``` | string | string of non repeating symbols that must include all the characters used both in msg and key | its length = numerical base  |
| ```newCharset```  | string | string of non repeating symbols                                                               | its length = numerical base  |

```js
// instead of "sukymeo gra" any other arrangement would work, for ex. " aegkmorsuy" BUT with a different output!!
BaseN.encrypt({
    msg:"your message", 
    key:"key", 
    baseCharset:"sukymeo gra", 
    newCharset:"01"
});
/*  encoding a message from base15 to base2
 *  "sukymeo gra".length: 15
 *  "01".length: 2
 *  output: "1011100111011000100111011010110010001011"
 */

BaseN.encrypt({
    msg:"1011100111011000100111011010110010001011", 
    key:"key", 
    baseCharset:"01", 
    newCharset:"sukymeo gra"
});
/*  same logic applies here: parsing from base2 to base15
 *  output: "your message"
 */
```

## High precision but to an extent
Web browsers are pretty limited on the amount of data that they can store in a single integer, therefore math operations between very large numbers may be inprecise: so keep in mind that bigger messages, keys or charsets may introduce unexpected results!

```If either .encrypt() or .decrypt() returns an empty string, generally it's the keys fault in combination with the message (you should shorten/change either your message, your key or the charsets) or better yet, use .encryptSubstrings()/.decryptSubstring() with lower substringLength!!!```

## Using custom sets of characters
Keep in mind that ```baseCharset``` and ```newCharset``` have the same function as "0123456789" in the decimal numerical system: enumerating, from lowest to highest, the numerical value of a symbol, but you can easily mix things up (for ex. "9302756184") and it would be very difficult to brute force a value without knowing both the charsets symbol order.

## Encryption of big chuncks of data
There is another way to encode a message: ```encryptSubstrings``` & ```decryptSubstrings```

they're pretty similar to the main functions but have some extra arguments
| name                   | extra arguments            | description                                                                                     |
|:-----------------------|:--------------------------:|:------------------------------------------------------------------------------------------------|
| ```encryptSubstrings``` | fragmentation, inBetween   | ```substringLength``` is the max size of the substrings, while ```inBetween``` is a string or a seriers of strings that "stitches" everything together |
| ```decryptSubstrings```   | inBetween                  | in this case ```inBetween``` is needed to split ```msg``` and get an array of strings to decode |
```js
const longString = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit, enim et tempus cursus, magna nisi ullamcorper ipsum, vitae facilisis elit neque sed justo. Cras laoreet, erat non dignissim interdum, sapien mi sagittis ante, in sagittis nulla ligula sit amet augue. Morbi laoreet urna at enim venenatis, id lobortis purus ornare. Sed ut magna eget dui dignissim aliquet molestie ac elit. Sed volutpat vulputate ipsum ac interdum. Fusce dignissim, turpis sit amet feugiat egestas, turpis enim hendrerit justo, non congue ex orci sit amet sem. Cras venenatis augue posuere suscipit commodo. Donec vel sagittis ante. Aenean lacinia tortor eget magna malesuada, vitae ultricies lacus ultricies. Nullam bibendum urna eget justo dignissim, sed rutrum dolor aliquet. Suspendisse feugiat tortor eget tempor euismod. Mauris convallis laoreet tortor at tristique. Maecenas eleifend fringilla mi. Nam eu mauris cursus magna lobortis accumsan.`;

const key = "Random key";

const charset = BaseN.charsetFromMsgAndKey(longString, key, 10);
// output: "bDmLgxoiF hfvrdqpSNuCcA,tnMjs.laeRky"

const encrypted = BaseN.encryptSubstrings({
    msg:longString, 
    key, 
    baseCharset:charset, 
    newCharset:"012345",
    substringLength:10
});
// output: "015311011321340443030 014441035201055233010 052443521224113231515 053154002115315410322 003435553414401212313 025133430104552523330 033323242555310320351 033322404545315204422 004010105220203413022 045521013014513224450 010023542111222215530 002113521031050443420 025321313010313230210 052124042505101213210 050323242235040505540 004542011434521325552 043152435251301313353 025113535525321502122 004423505434145515521 023352530244445125510 053014040523131555553 003550011111330215553 003355505101222233340 052132342414152043313 023012430241410413255 003443430443225015553 023010210335314233330 010524114434245304210 025113535525321505530 033023542214052022310 014440511125310012210 050000130521424254215 033010013432400311353 025310500212221055534 004430150101331015040 003444033224052321310 025435533111223045201 025123430533221505401 022114113101220233342 025133430104552453421 025415515014003012222 032523453014120503422 023553250321420435510 053014040523131055511 043152211432245242310 050155521151415410333 023150213414052004451 052440411010440012222 004354113115223555545 043421230241421515201 025454000522221315345 025142013101113232315 053442135110400025551 011445440031152045345 025125111101423014454 025531010241355022351 053122430241420415030 004441235243221313422 050523202412440505542 011235035521123224315 053132142515324233050 010322405414452012345 004100103224221012322 002122130111225232215 033015440545243022222 014125200211331013251 050523541213552305345 003130150204055211510 004150215213300045530 002010530031221043122 042523515210241105205 004021050321300312350 025135311101422413045 022441030444140043010 014000213222252311345 033525042521124200322 003115552025315055534 043151311112240043051 025404050441220505545 022422435511420243445 025014021041055233430 023155035524552523330 033323242031110303355 002323242215145313451 052442435514045315550 052442440414514210530 004100101225312022350 050444115221154022321 025400530110440003250 024230014433125125551 043445110012140045542 043423250241331015040 003443435301050505353 025122102010323012354"

const decrypted = BaseN.decryptSubstrings({
    msg:encrypted, 
    key, 
    baseCharset:"012345", 
    newCharset:charset
});

decrypted === longString // true
```
Examples with ```inBetween```:
```js
const encrypted1 = BaseN.encryptSubstrings({
    msg:longString, 
    key, 
    baseCharset:charset, 
    newCharset:"012345",
    substringLength:10,
    inBetween:"-"
});
// "015311011321340443030-014441035201055233010-052443521224113231515-053154002115315410322-003435553414401212313-025133430104552523330-033323242555310320351-033322404545315204422-004010105220203413022-045521013014513224450-010023542111222215530-002113521031050443420-025321313010313230210-052124042505101213210-050323242235040505540-004542011434521325552-043152435251301313353-025113535525321502122-004423505434145515521-023352530244445125510-053014040523131555553-003550011111330215553-003355505101222233340-052132342414152043313-023012430241410413255-003443430443225015553-023010210335314233330-010524114434245304210-025113535525321505530-033023542214052022310-014440511125310012210-050000130521424254215-033010013432400311353-025310500212221055534-004430150101331015040-003444033224052321310-025435533111223045201-025123430533221505401-022114113101220233342-025133430104552453421-025415515014003012222-032523453014120503422-023553250321420435510-053014040523131055511-043152211432245242310-050155521151415410333-023150213414052004451-052440411010440012222-004354113115223555545-043421230241421515201-025454000522221315345-025142013101113232315-053442135110400025551-011445440031152045345-025125111101423014454-025531010241355022351-053122430241420415030-004441235243221313422-050523202412440505542-011235035521123224315-053132142515324233050-010322405414452012345-004100103224221012322-002122130111225232215-033015440545243022222-014125200211331013251-050523541213552305345-003130150204055211510-004150215213300045530-002010530031221043122-042523515210241105205-004021050321300312350-025135311101422413045-022441030444140043010-014000213222252311345-033525042521124200322-003115552025315055534-043151311112240043051-025404050441220505545-022422435511420243445-025014021041055233430-023155035524552523330-033323242031110303355-002323242215145313451-052442435514045315550-052442440414514210530-004100101225312022350-050444115221154022321-025400530110440003250-024230014433125125551-043445110012140045542-043423250241331015040-003443435301050505353-025122102010323012354"

const decrypted1 = BaseN.decryptSubstrings({
    msg:encrypted1, 
    key, 
    baseCharset:"012345", 
    newCharset:charset, 
    inBetween:"-"
});
decrypted1 === longString; // true

const encrypted2 = BaseN.encryptSubstrings({
    msg:longString, 
    key, 
    baseCharset:charset, 
    newCharset:"012345",
    substringLength:10,
    inBetween:["-","$","^"] // this is a serie, which means that it will go in a loop for as long as the (message / substringLength) is, creating a pattern: "-","$","^","-","$","^","-","$","^"....
    // also you can make a serie of many repeating strings.
});
// "015311011321340443030-014441035201055233010$052443521224113231515^053154002115315410322-003435553414401212313$025133430104552523330^033323242555310320351-033322404545315204422$004010105220203413022^045521013014513224450-010023542111222215530$002113521031050443420^025321313010313230210-052124042505101213210$050323242235040505540^004542011434521325552-043152435251301313353$025113535525321502122^004423505434145515521-023352530244445125510$053014040523131555553^003550011111330215553-003355505101222233340$052132342414152043313^023012430241410413255-003443430443225015553$023010210335314233330^010524114434245304210-025113535525321505530$033023542214052022310^014440511125310012210-050000130521424254215$033010013432400311353^025310500212221055534-004430150101331015040$003444033224052321310^025435533111223045201-025123430533221505401$022114113101220233342^025133430104552453421-025415515014003012222$032523453014120503422^023553250321420435510-053014040523131055511$043152211432245242310^050155521151415410333-023150213414052004451$052440411010440012222^004354113115223555545-043421230241421515201$025454000522221315345^025142013101113232315-053442135110400025551$011445440031152045345^025125111101423014454-025531010241355022351$053122430241420415030^004441235243221313422-050523202412440505542$011235035521123224315^053132142515324233050-010322405414452012345$004100103224221012322^002122130111225232215-033015440545243022222$014125200211331013251^050523541213552305345-003130150204055211510$004150215213300045530^002010530031221043122-042523515210241105205$004021050321300312350^025135311101422413045-022441030444140043010$014000213222252311345^033525042521124200322-003115552025315055534$043151311112240043051^025404050441220505545-022422435511420243445$025014021041055233430^023155035524552523330-033323242031110303355$002323242215145313451^052442435514045315550-052442440414514210530$004100101225312022350^050444115221154022321-025400530110440003250$024230014433125125551^043445110012140045542-043423250241331015040$003443435301050505353^025122102010323012354"

const decrypted2 = BaseN.decryptSubstrings({
    msg:encrypted2, 
    key, 
    baseCharset:"012345", 
    newCharset:charset, 
    inBetween:["-","$","^"]
});
decrypted2 === longString; // true
```
## Bonus
There are two other methods:
| name                    | arguments              | description                                                                                   |
|:------------------------|:----------------------:|:----------------------------------------------------------------------------------------------|
| ```charsetFromMsgAndKey``` | msg, key, substringLength | an easier way of getting a safe charset that includes symbols from both message and key  |
| ```extractAndRandomize``` | msg, substringLength | extracts the charset from msg and safely reorders it         |
| ```extractCharset```    | input                 | given an input, this function will return a string of all the characters ignoring duplicates  |
```js
BaseN.extractAndRandomize("abcdefg0123456");
/* output: "5fga6c2d3b140e"
 * the output will never have "a" as the first character
 */

BaseN.extractAndRandomize("abcdefghij", 2);
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
BaseN.encrypt({
    msg:"arc",
    key:"key",
    baseCharset,
    newCharset:"0123"
});
// output: "33313222"

BaseN.decrypt({
    msg:"33313222",
    key:"key",
    baseCharset:"0123",
    newCharset:baseCharset
});
/* output: "rc"
 *
 * But why?
 * "a" from "arc" is the same as writing a "0" before a number, because in our baseCharset it's actually the first symbol
 * therefore during the encryption fase it will be discarded
 * BaseN.charsetFromMsgAndKey always makes sure that there won't be a situation like this!
 */
```

### Have fun!
