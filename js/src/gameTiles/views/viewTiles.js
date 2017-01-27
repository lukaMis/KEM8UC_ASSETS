
var viewTiles = function() {
  'use strict';
  
  var instance = {};
  var lastTileClicked;
  var arrayOfTiles = [];
  var arrayOfTileTexts = [];

  const $selector = $('#viewTiles');

  var _populateTleTextArray = function(origArray) {
    arrayOfTileTexts.length = 0;
    for (var i = 0, max = origArray.length; i < max; i++) {
      arrayOfTileTexts[i] = origArray[i].name;
    }
    return arrayOfTileTexts;
  };
  
  var _makeTiles = function (array) {
    for (let index = 0; index < array.length; index++) {
      let tile = Object.create( Tile.prototype );
      tile.id = 'tile-' + index;
      tile.text = array[index];
      tile.parent =  '#viewTiles';
      tile.init();
      $(tile).on('onTileClick', _handleTileClick);
      $(tile).on('onTileColorReset', _onTileColorReset);
      setTimeout(() => {
        tile.show();
      }, 100 * index );
      arrayOfTiles.push(tile);
    }
  };
  
  var _handleTileClick = function(e, data) {
    // console.log(data.id);
    // console.log(data.text);
    // console.log(e.target);
    lastTileClicked = e.target;
    $(instance).trigger('onTileClick', {
      id: data.id,
      text: data.text
    });
  };

  var _onTileColorReset = function(e) {
    $(instance).trigger('onColorReset');
  };

  var _disable = function() {
    for (var i = 0, max = arrayOfTiles.length; i < max; i++) {
      arrayOfTiles[i].disableTile();
    }
  };
  
  var _enable = function() {
    for (var i = 0, max = arrayOfTiles.length; i < max; i++) {
      arrayOfTiles[i].enableTile();
    }
  };

  var _resetColor = function() {
    for (var i = 0, max = arrayOfTiles.length; i < max; i++) {
      arrayOfTiles[i].resetColor();
    }
  };


  var _handleFakeCorrect = function(whatWasCorrect) {
    for (var i = 0, max = arrayOfTiles.length; i < max; i++) {
      if(arrayOfTiles[i].text === whatWasCorrect) {
        arrayOfTiles[i].fakeCorrect();
        break;
      }
    }
  };


  var _updateTileText = function(array) {
    for (var i = 0, max = arrayOfTiles.length; i < max; i++) {
      arrayOfTiles[i].updateText(array[i]);
    }
  };


  var _shuffle = function(delayToWait) {

    var _delay = delayToWait || 25;
    
    let $tiles = $selector.find('.tile');

    setTimeout(() => {
      _resetColor();
      $tiles.addClass('scale-0');
    }, _delay);

    setTimeout(() => {
      _addShuffledTextsToTiles();
    }, _delay + 350);

    setTimeout(() => {
      $selector.find('.tile').removeClass('scale-0');
      _enable();
    }, _delay + 350 + _delay /2);
  };

  var _addShuffledTextsToTiles = function() {
    var _tempArray = ShuffleArray(arrayOfTileTexts);
    for (var i = 0, max = arrayOfTiles.length; i < max; i++) {
      arrayOfTiles[i].updateText(_tempArray[i]);
    }
  };
  
  
  /*
    PUBLIC API
  */
  
  instance.init = function(array) {
    _makeTiles( _populateTleTextArray(array) );
  };
  
  instance.handleWrong = function(index) {
    // if no index there is auto reset color to normal
    if(!index) {
      lastTileClicked.handleWrong(true);
    } else {
      console.log('handle third wrong');
      lastTileClicked.handleWrong(false);
    }
  };
  
  instance.handleCorrect = function() {
    lastTileClicked.handleCorrect();
  };

  instance.handleFakeCorrect = function(whatWasCorrect, delay) {
    var _delay = delay || 0;
    setTimeout(() => {
      _handleFakeCorrect(whatWasCorrect);
    }, _delay);
  };

  instance.disableTiles = function() {
    _disable();
  };

  instance.enableTiles = function() {
    _enable();
  };

  instance.resetTilesColor = function(delay) {
    var _delay = delay || 0;
    setTimeout(() => {
      _resetColor();
    }, _delay);
  };

  instance.shuffle = function(delayToWait) {
    
    _shuffle(delayToWait);

    // console.log('tiles shuffled');
  };

  instance.reset = function(array) {
    
    // _shuffle();
    _populateTleTextArray(array);
    _shuffle(200);
    // _updateTileText( _populateTleTextArray(array) );
  };

  console.log('viewTiles ready');
  return instance;
}

/*

var viewTiles = function() {
  'use strict';

  var instance = {};
  const $selector = $('#viewTiles');
  const TILES_CREATE_DELAY = 150;
  var lastTileClicked;

  const USE_SHUFFLE = true;
  var useShuffle = false;

  const RESET_COLOR_DELAY = 500;

  const USE_SCALE_WHEN_SHUFFLING = true;

  var atTheEnd = false;

  var addListener = true;

  // const ALL_PAIRS = i18n.t('pairs', { returnObjectTrees: true });
  // var gamePairsArray = [];
  
  // var useShuffle = true;
  
  // const MAX_PAIRS = 8;

  // var currentPairCounter = 0;
  
  

  // var currentPair;


  // var _getGamePairs = function() {
  //   gamePairsArray.length = 0;

  //   for (let i = 0, max = ALL_PAIRS.length; i < max; i++) {
  //     gamePairsArray[i] = ALL_PAIRS[i];
  //   }
  //   if (useShuffle) {
  //     ShuffleArray(gamePairsArray);
  //   }
  //   gamePairsArray.length = MAX_PAIRS;
  //   $(instance).trigger('onGamePairsReady', { gamePairs:gamePairsArray });
  // };

  var _makeTiles = function(textArray) {
    
    var _array = textArray;
    var max = _array.length;
    var _tilesString = '';

    for (let i = 0; i < max; i++) {
      _tilesString += '<div class="tile scale-0"><p>' + _array[i]  + '</p></div>';
    }
    $selector.append(_tilesString);

    for (let i = 0; i < max; i++) {
      let _tile = $($selector.find('.tile')[i]);
      setTimeout(() => {
        _tile.removeClass('scale-0');
      }, TILES_CREATE_DELAY * i);
    }
  };

  var _addEventListener = function() {
    $selector.on('click', _onTileClick);
    console.log('_addEventListener added');
  };

  var _removeEventListener = function() {
    $selector.off('click', _onTileClick);
  };
  
  var _onTileClick = function(e) {
    _removeEventListener();

    var $target = $(e.target);
    if( !$target.hasClass('tile') ) {
      console.log('not tile!');
      _addEventListener();
      return;
    }

    lastTileClicked = $target;

    var _tileText = $target.find('p').text();
    $(instance).trigger('onTileClick', {tileText:_tileText});
  };


  var _resetColor = function(tile) {
    tile.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', _onEndOfColorReset );
    tile.removeClass().addClass('tile');
  };


  var _onEndOfColorReset = function(e) {
    $(this).off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', _onEndOfColorReset );
    console.log('_onEndOfColorReset');

    console.log('_onEndOfColorReset', 'useShuffle', useShuffle);    

    if(useShuffle) {
      instance.shuffle();
      useShuffle = false;
    }

    if(!atTheEnd) {
      if(addListener) {
        _addEventListener();
      }
    }
  };


  // var _getCurrentPair = function(_currentPairCounter) {
  //   currentPair = gamePairsArray[_currentPairCounter];
  //   console.log(currentPair);
  // };

  */


  /*
    PUBLIC API
  */

/*
  instance.shuffle = function () {

    if(USE_SCALE_WHEN_SHUFFLING) {
      let $tiles = $selector.find('.tile').addClass('scale-0');

      setTimeout(() => {
        $tiles.shuffle();
      }, RESET_COLOR_DELAY / 2);

      setTimeout(() => {
        var max = $selector.find('.tile').length;
        for (let i = 0; i < max; i++) {
        // $selector.find('.tile').removeClass('scale-0');
        let _tile = $($selector.find('.tile')[i]);
        setTimeout(() => {
          _tile.removeClass('scale-0');
        }, TILES_CREATE_DELAY / 2 * i);
      }

      addListener = true;
      _addEventListener();

      }, RESET_COLOR_DELAY);
    } else {
      let $tiles = $selector.find('.tile');
      $tiles.shuffle();
    }



    console.log('tiles shuffled');
  };

  instance.disableTiles = function () {
    useShuffle = false;
    atTheEnd = true;
    console.log('disableTiles useShuffle', useShuffle);
    _removeEventListener();
    console.log('disableTiles DONE');
  };

  instance.hintTheCorrectForTheNextTime = function(nameToFind) {
    console.log('hintTheCorrectForTheNextTime:', nameToFind);
    var _toHint;

    var $tiles = $selector.find('.tile');
    for (var i = 0; i < $tiles.length; i++) {
      var _tileText = $($tiles[i]).find('p').text();
      if(_tileText === nameToFind) {
        _toHint = $($tiles[i]);
        break;
      }
    }

    addListener = false;

    setTimeout(() => {
      addListener = true;
      _toHint.addClass('g');

      setTimeout(() => {
        addListener = true;
        _resetColor(_toHint);
      }, RESET_COLOR_DELAY);

    }, RESET_COLOR_DELAY * 2 );


    // setTimeout(() => {
    //   addListener = true;
    //   _resetColor(_toHint);
    //   // _toHint.removeClass().addClass('tile');
    // }, RESET_COLOR_DELAY * 2);

  };

  instance.handleCorrect = function() {
    lastTileClicked.addClass('g');

    useShuffle = true;
    addListener = false;
    console.log('handleCorrect useShuffle', useShuffle);
    
    setTimeout(() => {
      _resetColor(lastTileClicked);
    }, RESET_COLOR_DELAY);

    // setTimeout(() => {
    //   instance.shuffle();
    // }, RESET_COLOR_DELAY + 300);
  };

  instance.handleWrong = function() {
    lastTileClicked.addClass('r');
    setTimeout(() => {
      _resetColor(lastTileClicked);
    }, RESET_COLOR_DELAY);
  };

  instance.makeTiles = function(textArray) {
    _makeTiles(textArray);
  };

  instance.init = function(textArray) {
    // _getGamePairs();
    // _makeTiles();
    // _getCurrentPair(currentPairCounter);
    _makeTiles(textArray);
    _addEventListener();
  };

  instance.reset = function() {
    // currentPairCounter= 0;
    // _getGamePairs();
    // _makeTiles();
    // _getCurrentPair(currentPairCounter);
  };

  console.log('viewTiles ready');
  return instance;
};

*/