/*
 * Require-CSS RequireJS css! loader plugin
 * 0.0.8
 * Guy Bedford 2013
 * MIT
 */

/*
 *
 * Usage:
 *  require(['css!./mycssFile']);
 *
 * Tested and working in (up to latest versions as of March 2013):
 * Android
 * iOS 6
 * IE 6 - 10
 * Chome 3 - 26
 * Firefox 3.5 - 19
 * Opera 10 - 12
 * 
 * browserling.com used for virtual testing environment
 *
 * Credit to B Cavalier & J Hann for the IE 6 - 9 method,
 * refined with help from Martin Cermak
 * 
 * Sources that helped along the way:
 * - https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 * - http://www.phpied.com/when-is-a-stylesheet-really-loaded/
 * - https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
 *
 */

define(function() {
  if (typeof window == 'undefined')
    return { load: function(n, r, load){ load() } };

  var head = document.getElementsByTagName('head')[0];
  
  var firstScript = head.getElementsByTagName('script')[0];

  var engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)/) || 0;

  // use <style> @import load method (IE < 9, Firefox < 18)
  var useImportLoad = false;
  
  // set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
  var useOnload = true;

  // trident / msie
  if (engine[1] || engine[7])
    useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9;
  // webkit
  else if (engine[2])
    useOnload = false;
  // gecko
  else if (engine[4])
    useImportLoad = parseInt(engine[4]) < 18;
  
  //main api object
  var cssAPI = {};

  // Get the priority off of a link tag if it's set
  var getPriority = function(css) {
    return parseInt(css.getAttribute('data-priority'), 10);
  }
  
  // appends style before the first script tag in the head, to ensure that any page specific css is added
  var appendStyle = function (css) {
    for (var i = 0; i < document.head.children.length; i++) {
      var candidate = document.head.children[i];

      // If the element we're looking at has a higher priority than the one we're adding,
      // stop and insert the new node before this one
      if (css.hasAttribute('data-priority') && (getPriority(candidate) < getPriority(css))) {
        head.insertBefore(css, candidate);
        return;
      }

      // Stop when we hit the first script
      if (candidate == firstScript) {
        break;
      }
    }

    // Last case, we didn't run into a script tag and we didn't find a priority-specific location for it,
    // so just add it to the end
    if (firstScript) {
      head.insertBefore(css, firstScript);
    } else {
      head.appendChild(css);
    }
  }

  // checks for a priority being set in the url
  var determinePriority = function(element, url) {
    var index, text = '?priority=';
    if ((index = url.indexOf(text)) > -1)  {
      element.setAttribute('data-priority', url.substring(index + text.length));
    } else {
      element.setAttribute('data-priority', 0);
    }
  }
  
  // <style> @import load method
  var curStyle;
  var createStyle = function () {
    curStyle = document.createElement('style');
    appendStyle(curStyle);
  }
  var importLoad = function(url, callback) {
    createStyle();
    determinePriority(curStyle, url);

    var curSheet = curStyle.styleSheet || curStyle.sheet;

    if (curSheet && curSheet.addImport) {
      // old IE
      curSheet.addImport(url);
      curStyle.onload = callback;
    }
    else {
      // old Firefox
      curStyle.textContent = '@import "' + url + '";';

      var loadInterval = setInterval(function() {
        try {
          curStyle.sheet.cssRules;
          clearInterval(loadInterval);
          callback();
        } catch(e) {}
      }, 10);
    }
  }

  // <link> load method
  var linkLoad = function(url, callback) {
    var link = document.createElement('link');
    determinePriority(link, url);
    link.type = 'text/css';
    link.rel = 'stylesheet';
    if (useOnload)
      link.onload = function() {
        link.onload = function() {};
        // for style dimensions queries, a short delay can still be necessary
        setTimeout(callback, 7);
      }
    else
      var loadInterval = setInterval(function() {
        for (var i = 0; i < document.styleSheets.length; i++) {
          var sheet = document.styleSheets[i];
          if (sheet.href == link.href) {
            clearInterval(loadInterval);
            return callback();
          }
        }
      }, 10);
    link.href = url;
    appendStyle(link);
  }

  cssAPI.normalize = function(name, normalize) {
    return normalize(name);
  }
  
  cssAPI.load = function(cssId, req, load, config) {

    (useImportLoad ? importLoad : linkLoad)(req.toUrl(cssId), load);

  }

  return cssAPI;
});