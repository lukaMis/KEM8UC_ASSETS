


var WordSearch = function (configObject) {
  'use strict';

  var lettersToUse = configObject.lettersToUse || 'abcdefghijklmnoprsštuvzž';

  var wordsArray = configObject.wordsToFind;

  var explanationsArray = configObject.wordsExplanations;

  var MAX_LETTERS_TO_PLACE = configObject.maxWords || 6;
  
  var TOTAL_WORDS = MAX_LETTERS_TO_PLACE;
  console.log('MAX_LETTERS_TO_PLACE', MAX_LETTERS_TO_PLACE);

  var $explanationsSelector = $('.words-texts-wrapper .inner-wrapper');

  var HORIZONTAL_WORDS_NUMBER = 0;  // we get these later at random // = 3;
  var VERTICAL_WORDS_NUMBER = 0;  // we get these later at random // = 3;

  var BOARD_GENERATE_MAX_TRIES; // we get it later // = 1000;
  var boardGenerateCounter = 0;
  var BOARD_GRID_SIZE = 100;

  var DELAY_TO_CLEAR_BOARD = 1000;

  var activeIdsArrays = [];
  var clickedIdsArray = [];

  var classNotAccaptable = 'not-acceptable_';

  var arrayOfWordsForInsertion = [];
  var arrayOfWExplanationsForInsertion = [];
  
  var arrayOfIndexesToPlaceWords = [];
  var arrayOfIndexesToPlaceForInsertion = [];
  

  var $wordsBoard = $('.words-board');
  var $boardItems;
  var $boardItemsActive;
  var eventType = 'click';
  var clickCounter = 0;
  var clickedItemsString = '';

  var $currentBoardItem;
  var currentBoardItemIsActive;

  var solvedWordsCount = 0;

  var placedWordsCount = 0;

  var primaryPlacePosition;
  var secondaryPlacePosition;

  init();

  function init () {
    
    makeEmptyBoard(BOARD_GRID_SIZE);
    
    getBoardItems();

    shuffleArgumentsArray(wordsArray, explanationsArray);

    getArrayOfAllPossiblePlaces();
    shuffleArrayOfAllPossiblePlaces();
    duplicateArrayOfAllPossiblePlaces();
    
    placeWords();

    fillInTheBlanks();

    placeExplanations();

    addListenersToBoard();
  }

  function onBoardClick (e) {
    var _current = e.target;
    
    // if target is board item
    if ($(_current).hasClass('board-item') ){
      $currentBoardItem = $(_current);
    }
    else {
      return;
    }

    $currentBoardItem.addClass('selected');
    clickCounter++;

    // add to clicked array
    clickedIdsArray.push($currentBoardItem[0].id);
    // console.log(clickedIdsArray);

    if(clickCounter > 2 ) {
      removeListenersFromBoard();
      checkClickedIds(clickedIdsArray);
      return;
    }

  } // onBoardClick

  function checkClickedIds (clickedIdsArray) {
    
    var _currentArray = clickedIdsArray;
    var _currentClickedArrayLength = _currentArray.length;

    var _arraysNumToCheck = activeIdsArrays.length;
    var _innerArray;
    var _innerArrayLength = 0;

    var _matchesCount = 0;
    var _arrayPassesCheck = false;
    var _passableArrayIndex;

    for (var i = 0; i < _arraysNumToCheck; i++) {
      _innerArray = activeIdsArrays[i];
      _innerArrayLength = _innerArray.length;

      for (var ii = 0; ii < _currentClickedArrayLength; ii++) {
        // compare array items from clicked and active arrays
        if(_innerArray[ii] === _currentArray[ii]) {
          _matchesCount++;
        }
      };
      console.log('end of array:');
      console.log('_matchesCount:', _matchesCount);
      if(_currentClickedArrayLength === _matchesCount) {
        console.log('matches is the same as clicks:', _currentClickedArrayLength === _matchesCount);
        _arrayPassesCheck = true;
        _passableArrayIndex = i;
        break;
      }
    };

    if(!_arrayPassesCheck) {
      clearField();
    }
    else {
      handleCorrectArray(_currentArray, _passableArrayIndex);
    }

  } // checkClickedIds

  function handleCorrectArray (arrayOfClicked, indexOfMatchedArray) {
    // check if length of clicked items array is less than matches count
    if(arrayOfClicked.length < activeIdsArrays[indexOfMatchedArray].length) {
      console.log('allow clicking');
      addListenersToBoard();
    }
    else {
      console.log('we have whole array people.');
      handleWordFound(arrayOfClicked, indexOfMatchedArray);
    }
  }

  function handleWordFound (arrayOfClicked, indexOfMatchedArray) {
    // remove array from activeArrays, mark board items as solved
    var _array = activeIdsArrays[indexOfMatchedArray];
    var _arrayLength = _array.length;
    var _wordId =  $('#'+_array[0]).attr('data-index');
    for (var i = 0; i < _arrayLength; i++) {
      $('#'+_array[i]).removeClass('selected').addClass('solved');
    };

    addSolvedToExplanation(_wordId, arrayOfClicked);
    
    addSolvedCover(arrayOfClicked, indexOfMatchedArray);

    removeFoundWordFromArray(indexOfMatchedArray);
    var _getNewSolvedCount = updateSolvedCounter();

    if(_getNewSolvedCount < TOTAL_WORDS) {
      resetClickedParams();
      addListenersToBoard();
    }
    else {
      console.log('ALL DONE!!!!');
      setTimeout(function () {
        clearTheBoard();
      }, DELAY_TO_CLEAR_BOARD);
      
      setTimeout(function () {
        $('.board-item.solved').addClass('invisible-bg');
      }, DELAY_TO_CLEAR_BOARD * 4);
    }
  }

  function addSolvedToExplanation (id, arrayOfClicked) {
    var _array = arrayOfClicked;
    var _length = _array.length;
    var _letterToInsert = '';

    (function () {
      for (var i = 0; i < _length; i++) {
        var _currentLetter = $('#'+_array[i]).attr('data-letter');
        _letterToInsert += _currentLetter;
      };
    })();

    var _selector = $('#explanation-' + id).addClass('solved');
    _selector.find('.replaced-text').text(_letterToInsert);
  }

  function clearTheBoard () {
   var _emptyElements = $('.board-item').filter(function (ind, ele) {
      return !($(this).attr('data-active'));
    });
   var _length = _emptyElements.length;

   for (var i = 0; i < _length; i++) {
     (function (i) {
      setTimeout(function () {
        var _current = $(_emptyElements[i]);
        _current.addClass('off-canvas');
        _current.css({
          'z-index' : i
        });
      }, i * 50);
     })(i)
   };

  } // clearTheBoard



  function updateSolvedCounter () {
    solvedWordsCount++;

    return solvedWordsCount;
  }

  function removeFoundWordFromArray (indexOfMatchedArray) {
    activeIdsArrays.splice(indexOfMatchedArray, 1);
  }

  function addSolvedCover (arrayOfClicked, indexOfMatchedArray) {
    var _array = activeIdsArrays[indexOfMatchedArray];
    var _arrayLength = _array.length;
    var _positionsArray = [];
    
    var _posX = 0;
    var _posY = 0;
    var _width = 0;
    var _height = 0;

    ResizeToFullWindow.resetScale();

    for (var i = 0; i < _arrayLength; i++) {
      $('#'+_array[i]).removeClass('selected').addClass('solved');
      _positionsArray.push( $('#'+_array[i]).position() );
    };

    // check if we have horizontal letter
    if(_positionsArray[0].top === _positionsArray[1].top) {
      _posX = _positionsArray[0].left + 7;
      _posY = _positionsArray[0].top + 7;
      _width = (60 * arrayOfClicked.length) - 0;
      _height = 46;
    }
    // we have vertical letter
    else {
      _posX = _positionsArray[0].left + 9;
      _posY = _positionsArray[0].top + 6;
      _width = 46;
      _height = (60 * arrayOfClicked.length) + 2;
    }

    $wordsBoard.prepend(
      '<div class="solved-cover" id="solved-' + solvedWordsCount + '"></div>'
    );
    $('#' + 'solved-' + solvedWordsCount).css({
      'width' : _width,
      'height' : _height,
      'left' : _posX,
      'top' : _posY
    });

    ResizeToFullWindow.scale();
  }

  function clearField () {

    var _selectedToClear = $wordsBoard.find('.selected');

    resetClickedParams();
    
    _selectedToClear.each(function () {
      $(this).removeClass('selected');
    });

    addListenersToBoard();
  }

  function resetClickedParams () {
    clickedIdsArray.length = 0;
    clickCounter = 0;
  }

  function stringSearch (str) {
    var _currentItem;
    var _toReturn;

    for (var i = 0, max = wordsArray.length; i < max; i++) {
      _currentItem = wordsArray[i];
      if(_currentItem.indexOf(str) !== -1) {
        _toReturn = true;
        break;
      }
      else {
        _toReturn = false;
        // break;
      }
    }
    console.log(_currentItem, str, _currentItem.indexOf(str));
    return _toReturn;
  } // stringSearch

  function addListenersToBoard () {
    $wordsBoard.on(eventType, onBoardClick);
  }
  function removeListenersFromBoard () {
    $wordsBoard.off(eventType, onBoardClick);
  }

  function getBoardItems () {
    $boardItems = $('.board-item');
  }

  
  function makeEmptyBoard (maxItems) {
    
    var _id;

    for (var i = 0; i < maxItems; i++) {
      if(i < 10) {
        _id = 'board-item-0' + i;
      }
      else {
        _id = 'board-item-' + i;
      }

      $wordsBoard.append( '<div class="board-item" data-letter="" id=' + _id + '></div>' );
    };

  }


  function placeExplanations () {
    
    var _length = arrayOfWExplanationsForInsertion.length;

    for (var i = 0; i < _length; i++) {
      var _newIndex = 'explanation-' + i;
      $explanationsSelector.append(
        '<div class="explanation" id="' + _newIndex + '"><p><span>' + arrayOfWExplanationsForInsertion[i] + '</span></p></div>'
      );
    };

  }

  function shuffleArgumentsArray (wordsArray, explanationsArray) {
    var _getRandomIndexes;
    var _tempArray = [];
    var _length = wordsArray.length;

    console.log(wordsArray, explanationsArray);

    console.log('*****RANDOMIZE ARRAYS*****:');

    for (var i = 0; i < _length; i++) {
      _tempArray.push(i);
    };
    _getRandomIndexes = shuffleArray(_tempArray);

    for (var j = 0; j < _length; j++) {
      var _newWord = wordsArray[_getRandomIndexes[j]];
      arrayOfWordsForInsertion.push( _newWord );

      var _newExplanation = explanationsArray[_getRandomIndexes[j]];
      arrayOfWExplanationsForInsertion.push( _newExplanation );
    };

    console.log(arrayOfWordsForInsertion, arrayOfWExplanationsForInsertion);

    console.log('*****TRIM ARRAYS*****:');

    // make arrays max length
    arrayOfWordsForInsertion.length = TOTAL_WORDS;
    arrayOfWExplanationsForInsertion.length = TOTAL_WORDS;

    console.log(arrayOfWordsForInsertion, arrayOfWExplanationsForInsertion);
  }


  function getArrayOfAllPossiblePlaces () {
    for (var i = 0, max = $boardItems.length; i < max; i++) {
      arrayOfIndexesToPlaceWords.push(i);
    };
  }

  function shuffleArrayOfAllPossiblePlaces () {
    shuffleArray(arrayOfIndexesToPlaceWords);
  }

  function duplicateArrayOfAllPossiblePlaces () {
    arrayOfIndexesToPlaceForInsertion.length = 0;
    for (var i = 0, max = arrayOfIndexesToPlaceWords.length; i < max; i++) {
      arrayOfIndexesToPlaceForInsertion[i] = arrayOfIndexesToPlaceWords[i];
    };

    BOARD_GENERATE_MAX_TRIES = arrayOfIndexesToPlaceForInsertion.length;
    // console.log('BOARD_GENERATE_MAX_TRIES:', BOARD_GENERATE_MAX_TRIES);
  }




  function placeWords () {
    var _randomNumber = 0;

    console.log('***************** START PLACING WORDS *****************');

    for (var i = 0; i < TOTAL_WORDS; i++) {
      _randomNumber = Math.random();
      // _randomNumber = 0.3;
      if(_randomNumber > 0.5) {
        HORIZONTAL_WORDS_NUMBER++;

        primaryPlacePosition = 'hor';
        secondaryPlacePosition = 'ver';

        // horizontalPlacer();
      }
      else {
        VERTICAL_WORDS_NUMBER++;
        
        primaryPlacePosition = 'ver';
        secondaryPlacePosition = 'hor';

        // verticalPlacer();
      }

      tryPrimaryPlacePosition(primaryPlacePosition);

      duplicateArrayOfAllPossiblePlaces();

      boardGenerateCounter = 0;

      placedWordsCount++;
    } // for
    console.log('HORIZONTAL_WORDS:', HORIZONTAL_WORDS_NUMBER);
    console.log('VERTICAL_WORDS:', VERTICAL_WORDS_NUMBER);
  } // placeWords

  function tryPrimaryPlacePosition (placePosition) {

    if(placePosition === 'hor') {
      console.log('horizontalPlacer()');
      horizontalPlacer();
    }
    else {
      console.log('verticalPlacer()');
      verticalPlacer();
    }
  }


  // function trySecondaryPlacePosition (placePosition) {

  //   if(placePosition > 'hor') {
  //     console.log('horizontalPlacer()');
  //     horizontalPlacer();
  //   }
  //   else {
  //     console.log('verticalPlacer()');
  //     verticalPlacer();
  //   }

  // }


  function verticalPlacer() {

    var _tryToPlaceWord =  placeLettersVertical();
    
    if ( !_tryToPlaceWord ) {
      console.log('verticalPlacer try again!');

      boardGenerateCounter++;
      console.log('*******************************************');
      console.log('boardGenerateCounter:', boardGenerateCounter);
      console.log('*******************************************');
      if(boardGenerateCounter < BOARD_GENERATE_MAX_TRIES) {
        verticalPlacer();
      }
      else {
        // document.location.reload();
        reloadDocument();
        return;
      }
    }
    else {
      console.log('verticalPlacer success!');
      return;
    }
  }
  
  function horizontalPlacer() {

    var _tryToPlaceWord =  placeLettersHorizontal();
    
    // if ( !_tryToPlaceWord ) {
    //   console.log('horizontalPlacer try again!');
    //   horizontalPlacer();
    // }
    if ( !_tryToPlaceWord ) {
      // console.log('horizontalPlacer try again!');
      
      boardGenerateCounter++;
      if(boardGenerateCounter < BOARD_GENERATE_MAX_TRIES) {
        horizontalPlacer();
      }
      else {
        // document.location.reload();
        reloadDocument();
        return;
      }
    }
    else {
      console.log('horizontalPlacer success!');
      return;
    }
  }


  function placeLettersVertical () {

    // VERTICAL RULES

    //  select random board 
    // var randomIndex = getRandomIndex($boardItems);
    var randomIndex = arrayOfIndexesToPlaceForInsertion[0];
    console.log('arrayOfIndexesToPlaceForInsertion.length:', arrayOfIndexesToPlaceForInsertion.length);
    // console.log('randomIndex to check:', randomIndex);

    if(arrayOfIndexesToPlaceForInsertion.length === 0) {
      console.log('** ALL OPTIONS CHECKED **');
      console.log('TRY SECONDARY OPTION');
      return false;
      // reloadDocument();
    }
  
    // check if selected index is empty:
    var _randomIndexIsEmpty = ($( $boardItems[randomIndex] ).attr('data-letter') === '' ) ? true:false;
    var _toReturn = true;

    // if index is not empty exit function
    if ( !_randomIndexIsEmpty ) {
      console.log('randomIndex has:', $( $boardItems[randomIndex] ).attr('data-letter'));
      // $( $boardItems[randomIndex] ).addClass(classNotAccaptable);
      removeFirstItemOfIndexesToUse();
      return false;
    }

    // check vertical space availability
    var _getRow = parseInt(randomIndex.toString().slice(0, 1));
    var _availablePlacesForHWordPlacement = 9 - _getRow + 1;

    var _wordToPlace = arrayOfWordsForInsertion[0];
    var _wordLength = _wordToPlace.length;
    var _enoughPlacesForWord = (_wordLength <= _availablePlacesForHWordPlacement);

    if(!_enoughPlacesForWord) {
      console.log('enough places for Word:', _enoughPlacesForWord);
      removeFirstItemOfIndexesToUse();
      return false;
    }

    if(_getRow > 7) {
      console.log('randomIndex:', randomIndex, 'we have too little space available:', _availablePlacesForHWordPlacement);
      // $( $boardItems[randomIndex] ).addClass(classNotAccaptable);
      removeFirstItemOfIndexesToUse();
      return false;
    }

    // if(_enoughPlacesForWord) {

    // }

    
    // check vertical spaces emptiness
    (function () {

      var _indexToCheck = randomIndex;
      var _maxIterations = _wordLength;
      var _counter = 0;

      incrementIterations();

      function incrementIterations () {

        if($( $boardItems[_indexToCheck] ).attr('data-letter') !== '') {
          var _letterToPlace = _wordToPlace[_counter];
          var _letterNowInPlace = $( $boardItems[_indexToCheck] ).attr('data-letter');
          // compare letter in object with the one we need to place
          if(_letterToPlace !== _letterNowInPlace) {
            console.log('We need to place:', _letterToPlace );
            console.log('Space has:', _letterNowInPlace );
            // $( $boardItems[_indexToCheck] ).addClass(classNotAccaptable);
            console.log('FUNCTION MUST TERMINATE');
            _toReturn = false;
            console.log('_toReturn:', _toReturn);
            removeFirstItemOfIndexesToUse();
            return false;
          }
        }

        _indexToCheck = _indexToCheck + 10;
        _counter++;
        if(_counter < _maxIterations) {
          incrementIterations();
        }
      } // incrementIterations

    })();


    // place them letters
    if(_toReturn) {
      console.log('SAFE TO PLACE LETTERS');

      var _indexToPlaceLetter = randomIndex;
      var _numOfLettersToPlace = _wordLength;
      var _counter = 0;
      var _activeIdsArray = [];

      placeVerticalLetters();

      activeIdsArrays.push(_activeIdsArray);

      arrayOfWordsForInsertion.shift();

      // duplicateArrayOfAllPossiblePlaces();
    } // if(_toReturn)


    function placeVerticalLetters () {

      $($boardItems[_indexToPlaceLetter]).attr('data-letter', _wordToPlace[_counter]);
      $($boardItems[_indexToPlaceLetter]).attr('data-active', true);
      $($boardItems[_indexToPlaceLetter]).attr('data-index', placedWordsCount);

      _activeIdsArray.push( $($boardItems[_indexToPlaceLetter])[0].id );
      // $($boardItems[_indexToPlaceLetter]).addClass('selected-vertical');

      _indexToPlaceLetter = _indexToPlaceLetter + 10;
      _counter++;
      if(_counter < _numOfLettersToPlace) {
        placeVerticalLetters();
      }
    } // placeVerticalLetters

    
    return _toReturn;
  }
 
  function removeFirstItemOfIndexesToUse () {
    arrayOfIndexesToPlaceForInsertion.shift();
  }

  function placeLettersHorizontal() {

    // HORIZONTAL RULES
    // select random element
    // var randomIndex = getRandomIndex($boardItems);
    var randomIndex = arrayOfIndexesToPlaceForInsertion[0];
    console.log('arrayOfIndexesToPlaceForInsertion.length:', arrayOfIndexesToPlaceForInsertion.length);
    if(arrayOfIndexesToPlaceForInsertion.length === 0) {
      console.log('** ALL OPTIONS CHECKED **');
      console.log('TRY SECONDARY OPTION');
      return false;
      // reloadDocument();
    }

    var _availablePlacesForHWordPlacement = 9 - parseInt(randomIndex.toString().slice(-1)) + 1 ;
    // $( $boardItems[randomIndex] ).addClass('color-1');

    // console.log(arrayOfWordsForInsertion);
    var _wordToPlace = arrayOfWordsForInsertion[0];
    var _wordLength = _wordToPlace.length;
    // console.log(arrayOfWordsForInsertion);
    // console.log(_wordToPlace, _wordLength, _availablePlacesForHWordPlacement );
    // console.log('Word is placable in current position:', (_wordLength <= _availablePlacesForHWordPlacement) );

    var _firstSpaceIsEmpty = ($( $boardItems[randomIndex] ).attr('data-letter') === '' ) ? true:false;
    var _enoughPlacesForWord = (_wordLength <= _availablePlacesForHWordPlacement);
    var _enoughEmptySpaces = true;

    if(_enoughPlacesForWord && _firstSpaceIsEmpty) {
      (function () {
        var _max = randomIndex + _wordLength;
        for (var i = randomIndex; i < _max; i++) {

          if($( $boardItems[i] ).attr('data-letter') !== '' ) {
            console.log('space occupied');
            console.log( $( $boardItems[i] ).attr('data-letter') );
            // $( $boardItems[i] ).addClass(classNotAccaptable);
            _enoughEmptySpaces = false;
            break;
          }
        };
      })();
    } 

    if(_enoughPlacesForWord && _firstSpaceIsEmpty && _enoughEmptySpaces) {
      placeLetters(randomIndex, _wordToPlace);
      // remove first array item
      arrayOfWordsForInsertion.shift();

      // duplicateArrayOfAllPossiblePlaces();
      return true;
    }
    else {
      removeFirstItemOfIndexesToUse();
      return false;
    }
  } // placeLettersHorizontal
  


  // HELPERS
  
  function fillInTheBlanks () {
    $boardItems.each(function () {
      // only fill empty spaces
      if( $(this).attr('data-letter') === '' ) {
        $(this).attr('data-letter', lettersToUse[getRandomIndex(lettersToUse)]);
      }
    });
  }

  function placeLetters (startIndex, string) {

    var _startIndex = startIndex;
    var _max = string.length;
    var _index = 0;
    var _activeIdsArray = [];

    for (var i = 0; i < _max; i++) {
      _index = _startIndex + i;
      $( $boardItems[_index] ).attr('data-letter', string[i]);
      // $( $boardItems[_index] ).addClass('selected');
      $( $boardItems[_index] ).attr('data-active', true);
      $( $boardItems[_index] ).attr('data-index', placedWordsCount);
      // console.log('$boardItems[_index]:', $($boardItems[_index])[0].id );
      _activeIdsArray.push( $($boardItems[_index])[0].id );
    };

    activeIdsArrays.push(_activeIdsArray);
  }

  function getRandomIndex (array) {
    var index = Math.floor(Math.random() * array.length);
    return index;
  }

  function getRandomCharacter (string) {
    var stringChar = string[Math.floor(Math.random()*string.length)];
    return stringChar;
  }

  function shuffleArray (o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  function reloadDocument () {
    document.location.reload();
    console.log(' document.location.reload() ');
  }


};
