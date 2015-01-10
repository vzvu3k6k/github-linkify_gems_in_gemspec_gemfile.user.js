// ==UserScript==
// @name           GitHub: Linkify gems in *.gemspec and Gemfile
// @version        0.2
// @author         vzvu3k6k
// @match          https://github.com/*
// @namespace      http://vzvu3k6k.tk/
// @license        CC0
// ==/UserScript==

var gemUrl = function(gemName){
  return 'http://sla.herokuapp.com/' + gemName;
};

var filters = {
  gemspec: function(node){
    if (!node.previousSibling) return false;
    return /spec\.add_(?:development_|runtime_)?dependency/.test(node.previousSibling.textContent);
  },
  gemfile: function(node){
    if (!node.previousSibling) return false;
    if (!node.previousSibling.previousSibling) return false;
    return /gem/.test(node.previousSibling.previousSibling.textContent);
  }
};

var tryLinkify = function (){
  var filePath = document.querySelector('.final-path');
  if (!filePath) return;
  filePath = filePath.textContent;

  var filter;
  if (/\.gemspec$/.test(filePath)) {
    filter = filters.gemspec;
  } else if (filePath === 'Gemfile') {
    filter = filters.gemfile;
  } else {
    return;
  }

  var labels = Array.prototype.filter.call(
    document.querySelector('.file .blob-wrapper').querySelectorAll('.pl-s1'),
    filter
  );

  labels.forEach(function(node){
    var textNode = node.childNodes[1];
    var a = document.createElement('a');
    a.appendChild(textNode.cloneNode());
    a.href = gemUrl(textNode.textContent);
    node.replaceChild(a, textNode);
  });
};

tryLinkify();

unsafeWindow.$(unsafeWindow.document).on('pjax:success', function(){
  tryLinkify();
});
