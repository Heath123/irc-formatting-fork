# IRC Formatting

Turns IRC formatted text into easy to use blocks. This library is meant to parse and facilitate compiling to and from the irc caret notation. If you're looking for a means to style messages that your bot sends out, or merely strip the formatting, I'd suggest you check out [`irc-colors`](https://www.npmjs.com/package/irc-colors) instead.

## Installation
`npm install irc-formatting --save`

## Usage

```javascript
> var ircf = require('irc-formatting');
> s = "Hello, \x02World\x0304,07!\x03\x02";
> b = ircf.parse(s);
[ Block {
    text: 'Hello, ',
    bold: false,
    italic: false,
    underline: false,
    reverse: false,
    color: -1,
    highlight: -1 },
  Block {
    text: 'World',
    bold: true,
    italic: false,
    underline: false,
    reverse: false,
    color: -1,
    highlight: -1 },
  Block {
    text: '!',
    bold: true,
    italic: false,
    underline: false,
    reverse: false,
    color: 4,
    highlight: 7 } ]
> ircf.renderIrc(b);
'Hello, \u0002World\u000304,07!\u000f'
> ircf.renderHtml(b);
'Hello, <b>World</b><span class="ircf-fg-4 ircf-bg-7"><b>!</b></span>'
```

### Methods
- `Block[] .parse(string text)`: Parse text into blocks
- `string .renderIrc(Block[] blocks)`: Turn blocks back into irc-formatted text.
- `string .renderHtml(Block[] blocks)`: Convert blocks into html (see below)
- `string .renderHtml(string text)`: Convert text into html (see below)
- `string .strip(Block[] blocks)`: Same as compile, but leaving out all formatting carets
- `string .strip(string text)`: Parse text and turn result into unformatted text
- `Block[] .removeStyle(Block[] blocks)`: Remove all non-color formatting from blocks
- `Block[] .removeColor(Block[] blocks)`: Remove all color from blocks
- `Block[] .compress(Block[] blocks)`: Merges adjacent blocks that have equal color and style, which can happen after the two first functions or when this library is used to render.
- `string .swigFilter(string input, bool inline)`: Convert irc-formatted text into html. If `inline` is set, it will concaterate each line instead of wrapping them in `<p>` tags.
- `string .swigInline(string input)`: Calls the above function with `true` as the second argument.

*Note*: `.removeStyle`, `.compress` and `.removeColor` does not clone the block array. `.strip` does not alter the blocks, however.

### `Block` Class
- `Block(Block prev, string text)`: Constructs a block. If `prev` is not `null`, the block will inherit style and color from it.
- `.equals(Block other)`: Returns `true` if block's style and color equals the other's. It does not check for text equality.
- `.isPlain()`: Return true if the block has no style or color.
- `.hasSameColor(Block other, bool reversed)`: Returns true if the blocks has the same color. If `reversed` argument is true and the current block has `.reverse` set, it will only return true if the colors are reversed.
- `.getColorString()`: Returns `XX` or `XX,YY` formatted string where `XX` is `.color` and `YY` is `.highlight`. Both numbers are padded to 2 length.

### Constants
- `.U`: Underline
- `.B`: Bold
- `.I`: Italic
- `.C`: Color
- `.R`: Reverse
- `.O`: Reset (`CTRL + O` on mIRC)

### HTML Rendering
`.U`, `.B` and `.I` will use `<u>`, `<b>` and `<i>` tags respectively, while the others will use `<span>`-tags with the following classes.

- `ircf-reverse`: Reversing is applied (color and higliht are swapped)
- `ircf-no-color`: The above class is set, but neither of the below are.
- `ircf-fg-X`: Foreground color (`X` = `block.color`)
- `ircf-bg-X`: Background color (`X` = `block.highlight`)

The output of `.renderHtml` is a string of tags without a tag wrapping all of it. `.swigFilter` will use the class `ircf-line` on its `<p>` tags.

### Using with swig
In the initialization phase of your `swig` instance, you can add custom filters to swig like this. Make note of the first parameter.

```javascript
swig.setFilter('ircf', require('irc-formatting').swigFilter);
```

Then you can use it in your templates like this.

```html
<!-- ... -->
<h1>Log file</h1>
{{logcontent|ircf}}
<!-- ... -->
```

## ISC License

Copyright (c) 2016, Gisle Aune

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE
