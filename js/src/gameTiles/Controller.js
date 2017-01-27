
var Controller = function() {
  'use strict';

  var controller = {};

  var dataRetriever = DataRetriever();
  dataRetriever.init(true);

  // var tilesTextsArray = dataRetriever.getTilesTexts();
  // var displayTextArray = dataRetriever.getDisplayTexts();
  var pairsArray = dataRetriever.getPairs();
  // var currentToFind = _getNewCurrent();
  const MAX_QUESTIONS = dataRetriever.getMax();
  document.MAX_QUESTIONS = MAX_QUESTIONS;

  var arrayOfWrongGuesses = [];
  var guessesCounter = 0;
  var wrongGuessCounter = 0;
  var correctGuessCounter = 0;
  
  
  var tiles = viewTiles();
  $(tiles).on('onTileClick', _onTileClick);
  $(tiles).on('onColorReset', _onColorReset);
  tiles.init( ShuffleArray(pairsArray) );

  function _onTileClick(e, data) {
    tiles.disableTiles();
    guessesCounter++;

    var _clickedTileText = data.text;
    var _correct = _checkIfCorrect(_clickedTileText);

    if(_correct) {
      correctGuessCounter++;
      _handleCorrect(correctGuessCounter);
    } else {
      wrongGuessCounter++;
      if(wrongGuessCounter === 3) {
        console.log('we have three wrong guesses people');
        _handleThirdWrong();
      } else {
        _handleWrong();
      }
    }    
  };


  function _onColorReset(e) {
    console.log('color reset');
    tiles.enableTiles();
  };


  _logger();
  var curentPair = _getNewCurrent();
  _logCurrentPair();
  _updatePairsArray();
  // _logger();

  var displayArea = viewDisplayArea();
  displayArea.init( curentPair.symbol );


  var iconPlayAgain = IconPlayAgain();
  $(iconPlayAgain).on('onPlayAgain', _onPlayAgain);
  iconPlayAgain.init();
  function _onPlayAgain(e) {
    _globalRoundReset();
  };


  var sidebar = viewSidebar();
  sidebar.init();



  var piechart = Piechart('#Piechart', MAX_QUESTIONS);
  piechart.init();


  /* HELPERS */
  function _handleCorrect(numOfGuesses) {
    tiles.handleCorrect();

    piechart.update(numOfGuesses);

    _handleChangeOfPair();
  };

  function _handleWrong() {
    tiles.handleWrong();
  };

  function _handleThirdWrong() {
    tiles.handleWrong(3);
    tiles.resetTilesColor(1000);
    tiles.handleFakeCorrect(curentPair.name, 1000);

    _addPairToWrongGuessesArray();

    setTimeout(() => {
      _handleChangeOfPair();
    }, 1000 * 1.5);
  };

  function _handleChangeOfPair() {

    _resetWrongCounter();
    // _updatePairsArray();
    
    // if there is something in array
    if(_updateCurrentPair() ) {
      _updatePairsArray();
      tiles.shuffle(1000);
      displayArea.displayText(curentPair.symbol, 1000 );
    } else {
      console.log('at the end people');
      _endOfRoundReached();
    }
  };

  function _updateCurrentPair() {
    curentPair = _getNewCurrent();
    _logCurrentPair();
    return curentPair;
  };

  function _updatePairsArray() {
    pairsArray.splice(0, 1);
    console.log('after spice....');
    _logger();
  };

  function _logger() {
    for (var i = 0; i < pairsArray.length; i++) {
      console.log('objs left:', pairsArray[i]);
    }
  };

  function _addPairToWrongGuessesArray() {
    arrayOfWrongGuesses.push(curentPair);
    console.log('arrayOfWrongGuesses', arrayOfWrongGuesses);
  };

  function _resetWrongCounter() {
    wrongGuessCounter = 0;
  };

  function _checkIfCorrect(textOfClicked) {
    return (textOfClicked === curentPair.name ? true:false);
  };

  function _getNewCurrent() {

    // check length of array
    if(pairsArray.length === 0) {
      // check length of wrong guesses
      if(arrayOfWrongGuesses.length === 0) {
        console.log('NO MORE arrayOfWrongGuesses');
        return undefined;
      } else {
        console.log('copy wrong guesses array to round array, than return it');
        _copyWrongGuesseesToRoundArray();
        return ShuffleArray(pairsArray)[0];
      }
    } else {
      return ShuffleArray(pairsArray)[0];
    }
    // return ShuffleArray(pairsArray)[0];
  };


  function _copyWrongGuesseesToRoundArray() {
    for (var i = 0, max = arrayOfWrongGuesses.length; i < max; i++) {
      pairsArray[i] = arrayOfWrongGuesses[i];
    }
    arrayOfWrongGuesses.length = 0;
  };

  function _endOfRoundReached() {
    piechart.hide(1000);
    iconPlayAgain.show(1250);
    tiles.resetTilesColor(1000);
    displayArea.displayResult(guessesCounter, 1000);
  };

  function _globalRoundReset() {
    dataRetriever.reset();

    // controller.reset();

    arrayOfWrongGuesses.length = 0;

    guessesCounter = 0;
    wrongGuessCounter = 0;
    correctGuessCounter = 0;

    pairsArray = dataRetriever.getPairs();
    curentPair = _getNewCurrent();
    _logCurrentPair();

    displayArea.reset(curentPair.symbol);
    tiles.reset( pairsArray );

    iconPlayAgain.reset();
    sidebar.reset();
    piechart.reset();

    _logger();
    _updatePairsArray();
    console.log('Controller ready again :)');


    // displayArea.reset(curentPair.symbol);
    // iconPlayAgain.reset();
    // sidebar.reset();
    // piechart.reset();
    // tiles.reset();
  };

  function _logCurrentPair() {
    console.log(' ');
    console.log('selected object:', curentPair);
    console.log(' ');
  };


  // controller.reset = function() {
  //   arrayOfWrongGuesses.length = 0;

  //   guessesCounter = 0;
  //   wrongGuessCounter = 0;
  //   correctGuessCounter = 0;

  //   pairsArray = dataRetriever.getPairs();
  //   curentPair = _getNewCurrent();
  //   _updatePairsArray();
  //   console.log('Controller ready again :)');
  // };


  // controller.getMax = function() {
  //   return MAX_QUESTIONS;
  // };
  
  // return controller;
  console.log('Controller ready');
};



// tiles.init( ShuffleArray(pairsArray) );