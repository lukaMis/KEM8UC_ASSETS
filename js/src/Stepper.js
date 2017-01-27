

/* Stepper 

It emits forward or backwards events on clicks on forward and backwards button.
It provides functionality to hide back and/or forward button if exercise needs it.
It shows current and available stepps (views) of exercise. Exercise will update these.

Usage:
  Stepper.setMaxSteps(5);
  $(Stepper).on('stepperClicked', stepperHandler);
  function stepperHandler (e, data) {
    if(data.direction === 'back') {
      // back was clicked
    }
    else {
      // forward was clicked
    }
    Stepper.setCurrentStep(currentStep);
}

*/

var Stepper = (function () {
  'use strict';

  var $back = $('.stepper-icon.backward');
  var $forward = $('.stepper-icon.forward');

  var $stepsCurrent = $('.stepper-text .steps-current');
  var $stepsTotal = $('.stepper-text .steps-total');
  
  var eventType = 'click';

  var DIRECTION_BACK = 'back';
  var DIRECTION_FORWARD = 'forward';

  var MAX_STEPS = 0; // set from exercise;


  var _addListenersToStepper = function _addListenersToStepper() {
    $back.on(eventType, onStepperClickHandler);
    $forward.on(eventType, onStepperClickHandler);
  };

  var _removeListenersFromStepper = function _removeListenersFromStepper() {
    $back.off(eventType, onStepperClickHandler);
    $forward.off(eventType, onStepperClickHandler);
  };


  var _setMaxSteps = function _setMaxSteps (maxSteps) {
    MAX_STEPS = maxSteps;
    $stepsTotal.text(MAX_STEPS);
  }

  var _setCurrentStep = function _setCurrentStep (currentStep) {
    var _currentStep = currentStep;
    
    if(_currentStep === 1 ) {
      _hideIcon('b');
    }
    else {
      _showIcon('b'); 
    }

    if(_currentStep === MAX_STEPS ) {
      _hideIcon('f');
      console.log('MAX');
    }
    else {
      _showIcon('f'); 
    }

    $stepsCurrent.text(_currentStep);
  }


  var _hideIcon = function _hideIcon (icon) {
    if(icon === 'back' || icon === 'b') {
      $back.addClass('invisible');
      $back.css('visibility', 'hidden');
    }
    if(icon === 'forward' || icon === 'f') {
      $forward.addClass('invisible');
      $forward.css('visibility', 'hidden');
    }
  }

  var _showIcon = function _showIcon (icon) {
    if(icon === 'back' || icon === 'b') {
      $back.removeClass('invisible');
      $back.css('visibility', 'visible');
    }
    if(icon === 'forward' || icon === 'f') {
      $forward.removeClass('invisible');
      $forward.css('visibility', 'visible');
    }
  }


  // INIT STUFF
  _hideIcon('b');
  _addListenersToStepper();


  // EVENT HANDLERS
  function onStepperClickHandler (e) {

    _removeListenersFromStepper();
    
    var _direction = ( $(e.target).hasClass('backward') ) ? 'back':'forward';

    // if(_direction === DIRECTION_BACK) {
    //   // console.log('going back');
    // }
    // if(_direction === DIRECTION_FORWARD) {
    //   console.log('to infinity and beyond');
    // }

    $(Stepper).trigger('stepperClicked', { 
      'direction': _direction
    });

    _addListenersToStepper();
  } //  onStepperClickHandler
  
  

  return {
    setMaxSteps : _setMaxSteps,
    setCurrentStep : _setCurrentStep,
    hideIcon : _hideIcon,
    showIcon : _showIcon
  };

})();