
/* 
  name: Shuffle array
  autor: Internets
 */

var ShuffleArray = function(o) {
  'use strict';
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};