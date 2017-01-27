

/*
  Name: ArrayElementsManipulator
  Author: Luka Mis
  Point: It replaces parts of strings in array with different strings
  Mainly used for WordSerach game to manipulate explanation texts to replace searched word with _ _ _ _.
*/

function ArrayElementsManipulator (arrayToManipulate, regToUse, replaceWith, skipFirstAndLastChar) {
  var _array = arrayToManipulate;
  var _regex = regToUse;
  var _toInsert = replaceWith;
  var _skipFirstAndLast = skipFirstAndLastChar || true;

  console.log(_toInsert);

  _array.forEach(function (element, index) {
    var _fullString = element;
    var _stringToReplace = _fullString.match(_regex);
    var _stringArray = _stringToReplace[0].split('');

    var _startIndex = _fullString.indexOf(_stringToReplace);
    var _endIndex = _startIndex + _stringArray.length;
    var _newString = '<span class="replaced-text">';

    _stringArray.forEach(function (char, index) {
      if(_skipFirstAndLast) {
        if(index === 0 || index === _stringArray.length-1 ) {
          return;
        }
      }
      _newString += _toInsert;
    });
    _newString += '</span>';

    _array[index] = _fullString.split(_stringToReplace).join(_newString);
  });

  return arrayToManipulate;
};