
var Piechart = function(selector, percentToUpdate) {
  'use strict';

  var $selector = $(selector) || $('#Piechart');
  var _percentToUpdate = percentToUpdate || 8;

  const instance = {};

  const MAX_QUESTIONS = 8;

  var canv = document.createElement('canvas');
  canv.width = 48; // get original canvas width
  canv.height = 48; //get original canvas height
  $selector.append(canv); // adds the canvas to the body element
  
  const canvas = $selector.find('canvas')[0];
  const context = canvas.getContext('2d');

  // to punch a hole in canvas element
  // context.globalCompositeOperation = 'xor';
  
  const center = {
    x: canvas.width/2,
    y: canvas.height/2
  };

  const colors = {
    blue : 'rgba(0, 180, 255, 1)',
    green : 'rgba(0, 167, 0, 1)',
    black : 'rgba(0, 0, 0, 1)',
    red : 'rgba(255, 0, 0, 1)',
    white : 'rgba(255, 255, 255, 1)',
    gray : 'rgba(55, 55, 55, 1)'
  };

  const canvasData = {
    width: canvas.width,
    height: canvas.height,
    radius: 25,
    fill: colors.blue
  };

  const smallCircleData = {
    radius: 10,
    fill: colors.black
  };

  const ARRAY_OF_MODES = [
    'source-over',
    'source-in',
    'source-out',
    'source-atop',
    'destination-over',
    'destination-in',
    'destination-out',
    'destination-atop',
    'xor'
  ];

  var requestAnimationId;
  const INCREMENT_STEP = 2 * Math.PI / 360 * 2;

  // var _percentOfCircle = 100 / _percentToUpdate * _index;
  // var _widthToDraw = _fullCircle / _percentToUpdate * _index;

  

  /* METHODS */

  const _setDefaultValues = function () {
    instance.counter = 0;
    instance.startAngle = -Math.PI / 2;
    instance.fullCircle = 2 * Math.PI;
  };

  const _show = function() {
    $selector.addClass('active');
  };

  const _hide = function() {
    $selector.removeClass('active');
  };

  const _drawBg = function() {
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, canvasData.radius, instance.startAngle, instance.fullCircle, false);
    context.fillStyle = colors.gray;
    context.fill();
  };

  const _drawFakeCenter = function() {
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, smallCircleData.radius, instance.startAngle, instance.fullCircle, false);
    context.fillStyle = colors.black;
    context.fill();
  };

  const _draw = function(index) {
    // context.clearRect(0, 0, canvasData.width, canvasData.height);
    
    var _index = index || 0;
    var _fullCircle = 2 * Math.PI;
    var _percentOfCircle = 100 / _percentToUpdate * _index;
    var _widthToDraw = _fullCircle / _percentToUpdate * _index;
    // var _startAngle = -Math.PI / 2;
    // var _endAngle = _startAngle + _widthToDraw;

    instance.counter = _index;
    instance.endAngle = -Math.PI / 2 + instance.fullCircle / _percentToUpdate * instance.counter;

    // context.globalCompositeOperation = ARRAY_OF_MODES[0];

    // instance.oldAngle = _startAngle;
    // instance.newAngle = _endAngle;
    // instance.maxAngle = _endAngle;
    // instance.updateSpeed = (_endAngle - _startAngle) / 100 * _index;

    // console.log('instance.updateSpeed', instance.updateSpeed);

    // globalCompositeOperation for PUNCHING HOLES IN CANVAS colors aka MASKING
    // context.globalCompositeOperation = 'xor';


    // make whole circle gray for background
    // context.beginPath();
    // context.moveTo(center.x, center.y);
    // context.arc(center.x, center.y, canvasData.radius, instance.startAngle, instance.fullCircle, false);
    // context.fillStyle = colors.gray;
    // context.fill();


    // Punch a hole in canvas with context.globalCompositeOperation = 'xor';
    // context.beginPath();
    // context.moveTo(center.x, center.y);
    // context.arc(center.x, center.y, smallCircleData.radius, instance.startAngle, instance.fullCircle, false);
    // context.fillStyle = colors.red;
    // context.fill();


    // change composite operation and draw our shape. :)
    // context.globalCompositeOperation = ARRAY_OF_MODES[3];
    
    
    // _updateArc(instance.oldAngle, instance.newAngle, instance.updateSpeed);

    context.beginPath();
    context.moveTo(center.x, center.y);
    context.fillStyle = colors.blue;

    requestAnimationId = requestAnimationFrame(() => {
      _updateArc(instance.counter);
    });

    // console.log(_startAngle, _endAngle);


    // requestAnimationFrame( _updateArc(instance.oldAngle, instance.newAngle, instance.updateSpeed) );

    // context.beginPath();
    // context.moveTo(center.x, center.y);
    // context.arc(center.x, center.y, canvasData.radius, instance.startAngle, instance.endAngle, false);
    // context.fillStyle = canvasData.fill;
    // context.fill();
  };

  var _updateArc = function(index) {
    var _endAngle = instance.startAngle + (INCREMENT_STEP);

    if(instance.startAngle >= instance.endAngle) {
      console.log('stop thisd now');
      instance.startAngle = instance.endAngle;
      cancelAnimationFrame(requestAnimationId);
      return;
    };

    // context.beginPath();
    // context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, canvasData.radius, instance.startAngle, _endAngle, false);
    // context.fillStyle = canvasData.fill;
    context.fill();
    
    instance.startAngle += INCREMENT_STEP;
    requestAnimationId = requestAnimationFrame(() => {
      _updateArc(instance.counter);
    });
  };


  var _makeMaskInChart = function() {
    context.globalCompositeOperation = 'xor';
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, smallCircleData.radius, instance.startAngle, instance.fullCircle, false);
    context.fillStyle = colors.red;
    context.fill();
  };


  var _clearCanvas = function() {
    context.clearRect(0, 0, canvasData.width, canvasData.height);
  };


  /*
    PUBLIC API
  */

  instance.init = function() {
    _setDefaultValues();
    _show();
    // _drawBg();
    _draw(0);
  };

  instance.update = function(newNumber) {
    _draw(newNumber);
  };

  instance.show = function() {
    _show();
  };

  instance.hide = function(delay) {
    var _delay = delay || 0;
    setTimeout(() => {
      _hide();
    }, _delay);
  };

  instance.reset = function() {
    _clearCanvas();
    instance.init();
  };

  console.log('Piechart ready');
  return instance;
};