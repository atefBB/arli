# Arli - Tools for an Arabic development

## Usage

### node

```bash
$ npm install arli
```

### bower

```bash
$ bower install arli
```

### browser

```html
<script src="arli.min.js"></script>
```

## API

### .arabize(str, [options])

Convert some characters to make the text more Arabian.

#### Arguments

- `str` (_string_): The string to convert.
- `[options=['date', 'number', 'dash', 'char']]` (_array_): Decide which features to use in the output.

You can use those features: `char`, `dash` or `dash-extra`, `date` or `date-reverse`, `number`.

- `char`: Arabic characters.
- `dash`: Remove Arabic dashes.
- `dash-extra`: Remove the extra Arabic dashes.
- `date`: Arabic date format.
- `date-reverse`: Reversed Arabic date format.
- `number`: Arabic numbers.

#### Returns

(_string_) an Arabian string.

##### Example

```js
arli.arabize('0123456789%(,;*)?');
// => '۰۱۲۳۴۵۶۷۸۹٪﴾،؛٭﴿؟''

arli.arabize('0123456789%(,;*)?', ['char']);
// => '0123456789٪﴾،؛٭﴿؟''
```

### .count(str, [type])

Count the matched characters in the string.

#### Arguments

- `str` (_string_): The string to count in.
- `[type]` (_string_): A regular expression pattern to be used.

You can use other patterns: `all`, `digit`, `every`, `letter`, `strict`, `punct`.

See [pattern options](#pattern-options) for more information.

#### Returns

(_number_) the number of the matched characters in the string.

##### Example

```js
arli.count('Hello!');
// => 0

arli.count('Hello! مرحبا');
// => 5

arli.count('Hello! مرحبا ۱۲۳', 'digit');
// => 3
```

### .countRest(str, [type])

Count the non matched characters in the string.

#### Arguments

- `str` (_String_):  The string to count in.
- `[type]` (_String_):  A regular expression pattern to be used.

You can use other patterns: `all`, `digit`, `every`, `letter`, `strict`, `punct`.

See [pattern options](#pattern-options) for more information.

#### Returns

(_Number_) the number of the non matched characters in the string.

##### Example

```js
arli.countRest('Hello!');
 => 6
arli.countRest('Hello! مرحبا');
 => 7
arli.countRest('Hello! مرحبا ۱۲۳', 'digit');
 => 13
```

### .dateize(str, [reverse])

Convert a date string to an Arabic format.

#### Arguments

- `str` (_String_):  The string to convert.
- `[reverse]` (_Boolean_):  Reverse the month and day in the output if set to true.

#### Returns

(_String_) an Arabic date format

##### Example

```js
arli.dateize('20,11,2015 20/11/2015 20-11-2015 20.11.2015 20 11 2015');
 => '20؍11؍2015 20؍11؍2015 20؍11؍2015 20؍11؍2015 20؍11؍2015'
arli.dateize('20/11/2015', true);
 => '11؍20؍2015'  Past it to an RTL env to see it right
```

### .extract(str, [type])

Output the matched characters from the string.

#### Arguments

- `str` (_String_):  The string to output from.
- `[type]` (_String_):  A regular expression pattern to be used.

You can use other patterns: `all`, `digit`, `every`, `letter`, `strict`, `punct`.

See [pattern options](#pattern-options) for more information.

#### Returns

(_String_) the matched characters.

##### Example

```js
arli.extract('Hello مرحبا');
 => 'مرحبا'
arli.extract('Hello مرحبا ۱۲۳', 'digit');
 => '۱۲۳'
```

### .has(str, [type])

Checks if the string has the matched pattern.

#### Arguments

- `str` (_String_):  The string to check.
- `[type]` (_String_):  A regular expression pattern to be used.

You can use other patterns: `all`, `digit`, `every`, `letter`, `strict`, `punct`.

See [pattern options](#pattern-options) for more information.

#### Returns

(_Boolean_) `true` if the pattern match, `else` otherwise.

##### Example

```js
arli.has('Hello مرحبا');
 => true
arli.has('Hello مرحبا ۱۲۳', 'digit');
 => true
arli.has('Hello مرحبا', 'digit');
 => false
```

### .how(str, [type])

Calculate the percentage of the matched pattern in the string.

#### Arguments

- `str` (_String_):  The string to calculate in.
- `[type]` (_String_):  A regular expression pattern to be used.

You can use other patterns: `all`, `digit`, `every`, `letter`, `strict`, `punct`.

See [pattern options](#pattern-options) for more information.

#### Returns

(_Number_) the percentage of the matched pattern.

##### Example

```js
arli.how('Hello مرحبا');
 => 45.45454545454545
arli.how('Hello مرحبا،،،، ۱۲۳', 'char');
 => 26.31578947368421
```

### .howRest(str, [type])

Calculate the percentage of the non matched pattern in the string.

#### Arguments

- `str` (_String_):  The string to calculate in.
- `[type]` (_String_):  A regular expression pattern to be used.

You can use other patterns: `all`, `digit`, `every`, `letter`, `strict`, `punct`.

See [pattern options](#pattern-options) for more information.

#### Returns

(_Number_) the percentage of the non matched pattern.

##### Example

```js
arli.howRest('Hello مرحبا');
 => 54.54545454545455
arli.howRest('Hello مرحبا،،،، ۱۲۳', 'char');
 => 73.6842105263158
```

### .numerize(str)

Convert a number string to an Arabic format.

#### Arguments

- `str` (_String_):  The string to convert.

#### Returns

(_String_) an Arabic date format

##### Example

```js
arli.numerize('0123456789');
 => '۰۱۲۳۴۵۶۷۸۹'
```

### .remove(str, [type])

Output the non matched characters from the string.

#### Arguments

- `str` (_String_):  The string to output from.
- `[type]` (_String_):  A regular expression pattern to be used.

You can use other patterns: `all`, `digit`, `every`, `letter`, `strict`, `punct`.

See [pattern options](#pattern-options) for more information.

#### Returns

(_String_) the non matched characters.

##### Example

```js
arli.remove('Hello مرحبا');
 => 'Hello '
arli.remove('Hello مرحبا ۱۲۳', 'digit');
 => 'Hello  مرحبا'
```

### .removeDash(str, [extra])

Remove the dash or Tatweel character from the string.

#### Arguments

- `str` (_String_):  The string to remove from.
- `[extra]` (_Boolean_):  Leave a single dash if set to true

#### Returns

(_String_) the new prepared string.

##### Example

```js
arli.removeDash('مرحبــــــــــا');
 => 'مرحبا'
arli.removeDash('مرحبــــــــــا', true);
 => 'مرحبـا'
```

### Pattern options

- `all`: All Arabic standard characters.
- `digit`: Arabic numbers.
- `every`: Every Arabic characters.
- `letter`: Arabic letters.
- `strict`: Strict Arabic characters.
- `punct`: Arabic punctuation.

## LICENCE

Copyright (c) 2015 Mohamed Elkebir <elkebir.med@gmail.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
