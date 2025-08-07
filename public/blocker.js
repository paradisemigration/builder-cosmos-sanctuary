// IMMEDIATE GLOBAL BLOCKER - ES5 COMPATIBLE
console.log("IMMEDIATE GLOBAL BLOCKER: Starting total lockdown");

// Block all possible request sources immediately
var hostname = window.location.hostname;

// 1. Override fetch globally
var originalFetch = window.fetch;
window.fetch = function() {
  var args = Array.prototype.slice.call(arguments);
  var url = args[0] && args[0].toString ? args[0].toString() : "";

  if (url.indexOf("/api/") !== -1 || (url.indexOf("://") !== -1 && url.indexOf(hostname) === -1)) {
    console.error("GLOBAL BLOCKED:", url);
    return Promise.resolve(new Response('{"blocked":true}', {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }));
  }

  return originalFetch.apply(window, args);
};

// 2. Override XMLHttpRequest with ES5 syntax
var OriginalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
  var xhr = new OriginalXHR();
  var blocked = false;

  var originalOpen = xhr.open;
  xhr.open = function(method, url) {
    var urlStr = url && url.toString ? url.toString() : "";

    if (urlStr.indexOf("/api/") !== -1 || (urlStr.indexOf("://") !== -1 && urlStr.indexOf(hostname) === -1)) {
      console.error("XHR BLOCKED:", urlStr);
      blocked = true;

      // Mock successful response
      setTimeout(function() {
        try {
          Object.defineProperty(xhr, "status", { value: 200, configurable: true });
          Object.defineProperty(xhr, "responseText", { value: "{}", configurable: true });
          Object.defineProperty(xhr, "readyState", { value: 4, configurable: true });
          if (xhr.onreadystatechange) xhr.onreadystatechange();
          if (xhr.onload) xhr.onload({ type: "load" });
        } catch(e) {
          console.warn("XHR mock setup error:", e);
        }
      }, 0);
      return;
    }

    return originalOpen.apply(xhr, arguments);
  };

  var originalSend = xhr.send;
  xhr.send = function() {
    if (blocked) return;
    return originalSend.apply(xhr, arguments);
  };

  var originalSetRequestHeader = xhr.setRequestHeader;
  xhr.setRequestHeader = function() {
    if (blocked) return;
    return originalSetRequestHeader.apply(xhr, arguments);
  };

  return xhr;
};

// 3. Block all error events
window.addEventListener("error", function(e) {
  console.warn("GLOBAL ERROR BLOCKED:", e.message || "unknown error");
  if (e.preventDefault) e.preventDefault();
  return false;
}, true);

window.addEventListener("unhandledrejection", function(e) {
  console.warn("GLOBAL REJECTION BLOCKED");
  if (e.preventDefault) e.preventDefault();
  return false;
});

console.log("IMMEDIATE GLOBAL BLOCKER: Total lockdown complete");
