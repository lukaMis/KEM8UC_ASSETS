
var DataRetriever = function() {
  'use strict';

  var instance = {};
  const ALL_PAIRS = i18n.t('pairs', { returnObjectTrees: true });
  
  var useShuffle = false;
  const MAX_PAIRS = 8;

  var pairsArray = [];
  var tilesTextArray = [];
  var displayItemsArray = [];


  var _getRoundPairs = function() {
    pairsArray.length = 0;

    for (let i = 0, max = ALL_PAIRS.length; i < max; i++) {
      pairsArray[i] = ALL_PAIRS[i];
    }
    if (useShuffle) {
      ShuffleArray(pairsArray);
    }
    pairsArray.length = MAX_PAIRS;
  };


  var _getTilesAndDisplayTexts = function() {
    tilesTextArray.length = 0;
    displayItemsArray.length = 0;
    for (let i = 0; i < MAX_PAIRS; i++) {
      tilesTextArray[i] = pairsArray[i].name;
      displayItemsArray[i] = pairsArray[i].symbol;
    }
  };


  /*
    PUBLIC API
  */

  instance.init = function(_useShuffle) {
    useShuffle = _useShuffle;
    _getRoundPairs();
    // _getTilesAndDisplayTexts();
  };

  instance.getTilesTexts = function() {
    return tilesTextArray;
  };

  instance.getDisplayTexts = function() {
    return displayItemsArray;
  };

  instance.getPairs = function() {
    return pairsArray;
  };

  instance.getMax = function() {
    return MAX_PAIRS;
  };

  instance.reset = function() {
    _getRoundPairs();
    // _getTilesAndDisplayTexts();
  };

  console.log('DataRetriever ready');
  return instance;  
};