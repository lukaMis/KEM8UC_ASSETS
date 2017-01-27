

var viewSidebar = function() {
  'use strict';

  var instance = {};
  const $selector = $('#viewSidebar');
  const $button = $('#sidebarButton');
  var sidebarIsOpen = true;


  var _addListnerToButton = function() {
    $button.on('click', _onButtonClick);
  };

  var _onButtonClick = function(e) {
    sidebarIsOpen = !sidebarIsOpen;
    if(sidebarIsOpen) {
      $selector.addClass('active');
    } else {
      $selector.removeClass('active');
    }
  };


  /*
    PUBLIC API
  */

  instance.init = function() {
    _addListnerToButton();
  };

  instance.reset = function() {
    
  };

  console.log('viewSidebar ready');
  return instance;
};