
var QuestionPanelMaker = function(questions, shuffleQuestions, shuffleAnswers) {
  'use strict';

  var _shuffleQuestions = shuffleQuestions;
  if(shuffleQuestions === undefined) {
    _shuffleQuestions = true;
  }
  console.log('QuestionPanelMaker _shuffleQuestions', _shuffleQuestions);
  if(_shuffleQuestions) {
    ShuffleArray(questions);
  }

  var _shuffleAnswers = shuffleAnswers;
  if(shuffleAnswers === undefined) {
    _shuffleAnswers = true;
  }
  console.log('QuestionPanelMaker _shuffleAnswers', _shuffleAnswers);


  const QUESTIONS_TO_MAKE = questions;
  const NUMBER_OF_QUESTIONS = QUESTIONS_TO_MAKE.length;

  var _makeQuestionPannels = function (_arrayOfQuestions, _maxLength) {
    var _questionPannelsStringAll = '';

    for (let i = 0; i < _maxLength; i++) {
      var _stringToAppend = '';
      var _startOfString = '<div class="panel question-panel">';
      var _questionString = '<div class="question-wrapper"><h1 class="question">' + _arrayOfQuestions[i].question + '</h1></div>';

      var _numOfCorrectAnswers = _arrayOfQuestions[i].correct.length;
      var _questionsDataType = (_numOfCorrectAnswers === 1) ? 'radio':'checkbox';
      var _questionsWrapperString = '<div class="answers-wrapper" data-type="' + _questionsDataType + '" data-correct-to-pass="' + _numOfCorrectAnswers + '">';
      
      var _buttonString = '<div class="button-wrapper"><div class="button icon-confirm-answer"></div></div>';
      var _endOfString = '</div>';

      var _answerArray = _arrayOfQuestions[i].answers;
      var _numberOfAnswers = _answerArray.length;
      var _allAnswersString = '';
      var _correctAnswersIndexArray = _arrayOfQuestions[i].correct;
      var _arrayOfAnswers = [];

      for (var j = 0; j < _numberOfAnswers; j++) {
        var _answerIsCorrect = false;
        for (var k = 0; k < _correctAnswersIndexArray.length; k++) {
          if(j === _correctAnswersIndexArray[k]) {
            _answerIsCorrect = true;
            break;
          }
        }
        var _anwserString = '<p class="answer" data-active="false" data-correct="'+ _answerIsCorrect +'">' + _answerArray[j] + '</p>';

        _arrayOfAnswers.push(_anwserString);
      }

      if(_shuffleAnswers) {
        ShuffleArray(_arrayOfAnswers);
      }

      _allAnswersString = _arrayOfAnswers.join('');
      
      _stringToAppend = _startOfString + _questionString + _questionsWrapperString + _allAnswersString + _endOfString + _buttonString + _endOfString;
      _questionPannelsStringAll += _stringToAppend;
    }
    return _questionPannelsStringAll;
  };

  return _makeQuestionPannels(QUESTIONS_TO_MAKE, NUMBER_OF_QUESTIONS);
};