
var Tile = function(text, id, parent) {
  
  this.text = text;
  this.id = id;
  this.parent = parent;
};

Tile.prototype = {
  
  COLOR_RESET_DELAY : 400,

  init : function () {
    //console.log('this is Tile id', this.id);
    //console.log('this is Tile text', this.text);
    this._makeTile();
    this._addEventListener();
    // console.log('Tile ready');
  },
  _makeTile : function() {
    $(this.parent).append('<div class="tile scale-0" id="' + this.id + '"><p>' + this.text + '</p></div>');
    this.selector = $('.tile#' + this.id);
  },
  showTile: function() {
    this.selector.removeClass('scale-0');
  },
  show: function() {
    this.showTile();
  },
  _addEventListener : function() {
    this.selector.one('click', this._onTileClick.bind(this));
  },
  _removeEventListener : function() {
    this.selector.off('click');
  },
  _onTileClick : function(e) {
    $(this).trigger('onTileClick', {
      id: this.id,
      text: this.text
    });
  },
  handleWrong: function(bool) {
    this.selector.addClass('r');
    if(bool) {
      this._resetColor();
    } else {
      console.log('no color auto reset');
    }
  },
  handleCorrect: function() {
    this.selector.addClass('g');
  },
  _resetColor: function() {
    setTimeout(() => {
      this.selector.removeClass().addClass('tile');
      $(this).trigger('onTileColorReset');
    }, this.COLOR_RESET_DELAY);
  },
  disableTile : function() {
    this._removeEventListener();
    // console.log('tile disabled')
  },
  enableTile : function() {
    this._addEventListener();
    // console.log('tile enabled');
  },
  fakeCorrect : function() {
    this.selector.addClass('g');
  },
  resetColor : function(delay) {
    this.selector.removeClass().addClass('tile');
    // var _delay = delay || 0;
    // setTimeout(() => {
    //   this.selector.removeClass().addClass('tile');
    // }, _delay);
  },
  updateText : function(newText) {
    this.text = newText;
    this.selector.find('p').html(newText);
  }
}