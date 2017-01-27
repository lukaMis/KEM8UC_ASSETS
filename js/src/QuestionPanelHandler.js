
var QuestionPanelHandler = function(selector) {
  'use strict';

  var instance = {};
  var panelIsCorrect = false;
  var $selector = $(selector);
  var answeredPanelCounter = 0;


  var _addListenerToQuestionsPannel = function () {
    selector.find('.answers-wrapper').on('click', _onQuestionPannelClick);
  };

  var _removeListenerFromQuestionsPannel = function () {
    selector.find('.answers-wrapper').off('click', _onQuestionPannelClick);
    console.log('QuestionPanelHandler listener removed');
  };


  var _onQuestionPannelClick = function (e) {
    // if you click to an empty space of the wrapper
    if(e.target === e.currentTarget) {
      return;
    }

    var $uiLayer = $(e.currentTarget).parent().parent();

    var $questionsWrapper = $(e.currentTarget);   
    var $questions = $questionsWrapper.find('.answer');
    var _questionsType = $(e.currentTarget).attr( 'data-type');
    var $pannel = $(e.currentTarget).parent();
    var $submit = $pannel.find('.button.icon-confirm-answer').addClass('active');
    var _readyToSubmit = ($pannel.attr('data-ready-to-submit') === 'true') ? true:false;
    var _nededToPass = $questionsWrapper.attr('data-correct-to-pass');
    var $questionClicked = $(e.target);
    
    panelIsCorrect = false;

    /* checkbox stuff */
    if(_questionsType === 'checkbox') {
      $questionClicked.toggleClass('active');
      let _toggled = ($questionClicked.attr( 'data-active') === 'false') ? false:true;
      _toggled = !_toggled;
      $questionClicked.attr('data-active', _toggled);
      
      let _numberOfActiveAnwers = $pannel.find('[data-active="true"]').length;
      let _numberOfNeededAnswers = $pannel.find('[data-correct="true"]').length;


      if(_numberOfActiveAnwers === 0) {
        $submit.removeClass('active');
        return;
      }

      if( _numberOfActiveAnwers != _numberOfNeededAnswers) {
        panelIsCorrect = false;
      } else {
        let $questionsToCheck = $pannel.find( '[data-correct=true]' );
        let _numberOfQuestionsToCheck = $questionsToCheck.length;
        let _neededToPass = _numberOfQuestionsToCheck;
        let _correctCount = 0;

        for (let i = 0; i < _numberOfQuestionsToCheck; i++) {
          let _isActive = $($questionsToCheck[i]).attr('data-active');
          let _isCorrect = $($questionsToCheck[i]).attr('data-correct');

          if(_isActive === 'true' && _isCorrect === 'true') {
            _correctCount++;
          }
        }
        if(_neededToPass === _correctCount) {
          panelIsCorrect = true;
        }
      }
    }

    /* radio stuff */
    if(_questionsType === 'radio') {
      // reset all questions
      $questions.removeClass('active').attr('data-active', false);

      // update clicked question
      $questionClicked.addClass('active').attr('data-active', true);

      // check validity of answer
      let _isActive = $questionClicked.attr('data-active');
      let _isCorrect = $questionClicked.attr('data-correct');

      if(_isActive === _isCorrect) {
        panelIsCorrect = true;
      }
    }
    // show our submit button

    if(_readyToSubmit) {
      return;
    }

    $submit.one('click', function (e) {
      answeredPanelCounter++;
      $pannel.removeClass('active');
      $uiLayer.removeClass('active');
      var _checkForPassability = panelIsCorrect;
      $(instance).trigger('onPanelAnswered', { 'pass' : panelIsCorrect } );
    });

    //  add attribute so we know that panel has been clicked and is ready to submit.
    $pannel.attr('data-ready-to-submit', true);
  };



  /*
    PUBLIC API
  */

  instance.show = function() {
    setTimeout( () => {
      $selector.find('.panel.question-panel').addClass('active');
    }, 30);
  };

  instance.addListener = function() {
    _addListenerToQuestionsPannel();
  };

  instance.removeListener = function() {
    _removeListenerFromQuestionsPannel();
  };

  return instance;
};