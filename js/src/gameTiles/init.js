
(function() {

  'use strict';
  $(document).one('i18nComplete', init);

  function init(e) {
    'use strict';
    
    if(FastClick) {
      FastClick.attach(document.body);
    }

    Controller();
    // window.Controller = Controller();

    $('body').removeClass('loading');
  };
  
})()