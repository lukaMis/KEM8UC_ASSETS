
(function () {
  'use strict';

  var Annotation = {};
  var $iconAnnotation = $('.icon-annotation');
  var $annotationWrapper = $('.annotation-wrapper');
  var $annotation = $('.annotation');
  var classActive = 'active';

  FastClick.attach(document.body);
  
  $annotationWrapper.on('click', annotationClick);

  function annotationClick (e) {
    
    e.preventDefault();
    e.stopPropagation();

    console.log('aaaaa');

    var isActive = ( $annotation.hasClass(classActive) ) ? Annotation.deactivate():Annotation.activate();
  };

  Annotation.activate = function () {
    $annotation.addClass(classActive);
    $iconAnnotation.addClass(classActive);
  };

  Annotation.deactivate = function () {
    $annotation.removeClass(classActive);
    $iconAnnotation.removeClass(classActive);

    // iPad remove hover state HACK
    setTimeout(function () {
      Annotation.removeIcon();
      Annotation.addIcon();
    }, 25);
  };

  Annotation.removeIcon = function () {
    $annotationWrapper.off('click', annotationClick);
    $iconAnnotation.remove();
    $iconAnnotation = null;
  };

  Annotation.addIcon = function () {
    $annotationWrapper.prepend( "<div class='icon-annotation'>" );
    $iconAnnotation = $('.icon-annotation');
    $annotationWrapper.on('click', annotationClick);
    Annotation.createLine();
  };

  Annotation.createLine = function () {
    var annotationLineDiv = document.createElement('div');
    annotationLineDiv.className = 'icon-annotation-line';
    $iconAnnotation.append(annotationLineDiv);
  };
  Annotation.createLine();

})();