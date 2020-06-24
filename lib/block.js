var zeropad = require('zeropad');

function Block(prev, text) {
  this.text = (typeof(text) !== 'undefined') ? text : null;

  if(prev != null) {
    this.bold = prev.bold;
    this.italic = prev.italic;
    this.underline = prev.underline;
    this.reverse = prev.reverse;
    this.color = prev.color;
    this.highlight = prev.highlight;
  } else {
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.reverse = false;
    this.color = -1;
    this.highlight = -1;
  }

  if(this.color > 99) {
    this.color = 99;
  }

  if(this.highlight > 99) {
    this.highlight = 99;
  }
}

Block.prototype.equals = function(other) {
  return (this.bold === other.bold
       && this.italic == other.italic
       && this.underline === other.underline
       && this.reverse === other.reverse
       && this.color === other.color
       && this.highlight === other.highlight)
}

Block.prototype.isPlain = function() {
  return (!this.bold && !this.italic && !this.underline && !this.reverse
          && this.color === -1 && this.highlight === -1);
}

Block.prototype.hasSameColor = function(other, reversed) {
  if(this.reverse && reversed) {
    return ((this.color === other.highlight || other.highlight === -1) && this.highlight === other.color);
  } else {
    return (this.color === other.color && this.highlight == other.highlight);
  }
}

Block.prototype.getColorString = function() {
  var str = '';

  if(this.color !== -1) {
    str = zeropad(this.color, 2);
  }

  if(this.highlight !== -1) {
    str += ',' + zeropad(this.highlight, 2);
  }

  return str;
}

Block.EMPTY = new Block(null, '');

module.exports = Block;
