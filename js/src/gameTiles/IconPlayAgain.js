
var IconPlayAgain = function() {
  'use strict';

  var instance = {};
  var $selector = $('#iconPlayAgain');


  var _addEventListener = function() {
    $selector.on('click', _onClick);
  };


  var _onClick = function(e) {
    _hide();
    console.log('onPlayAgain triggered');
    $(instance).trigger('onPlayAgain');
  };


  var _show = function() {
    $selector.addClass('active');
  };


  var _hide = function() {
    $selector.removeClass('active');
  };


  /*
    PUBLIC API
  */

  instance.init = function() {
    _addEventListener();
  };

  instance.show = function(delay) {
    var _delay = delay || 0;
    setTimeout(() => {
      _show();
    }, _delay);
  };

  instance.reset = function() {
    // _show();
  };


  return instance;
};
