

var viewDisplayArea = function() {
  'use strict';

  var instance = {};
  var $selector = $('#viewDisplayArea');
  var $textSelector = $selector.find('p');

  const TEXT_DISPLAY_DELAY = 250;

  const FEEDBACK_TEXT = i18n.t('feedbackText');
  const FEEDBACK_TEXT_HYPHEN = i18n.t('feedbackHyphen');
  const MAX_QUESTIONS = document.MAX_QUESTIONS;


  var _displayText = function(textToDisplay, delay) {
    var delay = delay || TEXT_DISPLAY_DELAY;
    $textSelector.addClass('scale-0');
    setTimeout(() => {
       $textSelector.html('').html(textToDisplay).removeClass('scale-0');
    }, delay);
  };


  var _resetTextClass = function() {
    $textSelector.removeClass();
  };
  

  /*
    PUBLIC API
  */

  instance.init = function(textToDisplay) {
    _displayText(textToDisplay);
  };

  
  instance.displayText = function(textToDisplay, delay) {
    var delay = delay || 0;
    setTimeout(() => {
      _displayText(textToDisplay, delay * 0.7);
    }, delay);
  };


  instance.displayResult = function(result, delay) {
    var _delay = delay || 0;
    
    var _wrongGuesses = result - MAX_QUESTIONS;
    console.log('result is', result);

    var _colorClass = '';
    
    if(_wrongGuesses < 4) {
      _colorClass = 'green';
    }
    else if(_wrongGuesses < 8) {
      _colorClass = 'yellow';
    }
    else {
      _colorClass = 'red';
    }

    var _resultClass = 'resultText';

    var _startSpan = '<span class="' + _resultClass + '">';
    var _middleSpan = '<span class="' + _colorClass + '">';
    var _endOfSpan = '</span>'

    var _textToDisplay = _startSpan + FEEDBACK_TEXT + ' ' + _middleSpan + _wrongGuesses + _endOfSpan + ' ' + FEEDBACK_TEXT_HYPHEN + ' ' + result +  _endOfSpan;
    console.log(_textToDisplay);

    setTimeout(() => {
      _displayText( _textToDisplay );
      $textSelector.addClass('displayResult');
    }, _delay);

    // setTimeout(() => {
    //   $textSelector.addClass('displayResult');
    // }, _delay + _delay/2);
  };


  instance.reset = function(textToDisplay) {
    _resetTextClass();
    _displayText(textToDisplay);
  };

  console.log('viewDisplayArea ready');
  return instance;
};