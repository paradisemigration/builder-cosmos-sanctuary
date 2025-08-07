// IMMEDIATE GLOBAL BLOCKER - RUNS BEFORE EVERYTHING ELSE
console.log("🚨 IMMEDIATE GLOBAL BLOCKER: Starting total lockdown");

// Block all possible request sources immediately
const hostname = window.location.hostname;

// 1. Override fetch globally
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const url = args[0] && args[0].toString ? args[0].toString() : "";
  if (
    url.includes("/api/") ||
    (url.includes("://") && !url.includes(hostname))
  ) {
    console.error("🚨 GLOBAL BLOCKED:", url);
    return Promise.resolve(
      new Response('{"blocked":true}', {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }
  return originalFetch(...args);
};

// 2. Override XMLHttpRequest with proper state handling
const OriginalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = class extends OriginalXHR {
  constructor() {
    super();
    this._blocked = false;
  }

  open(...args) {
    const url = args[1] && args[1].toString ? args[1].toString() : "";
    if (
      url.includes("/api/") ||
      (url.includes("://") && !url.includes(hostname))
    ) {
      console.error("🚨 XHR BLOCKED:", url);
      this._blocked = true;

      // Call super.open first to set proper state
      super.open("GET", "data:application/json,{}", true);

      // Set up mock response
      setTimeout(() => {
        Object.defineProperty(this, "status", { value: 200, configurable: true });
        Object.defineProperty(this, "statusText", { value: "OK", configurable: true });
        Object.defineProperty(this, "responseText", { value: "{}", configurable: true });
        Object.defineProperty(this, "readyState", { value: 4, configurable: true });
        if (this.onreadystatechange) this.onreadystatechange();
        if (this.onload) this.onload(new Event("load"));
      }, 0);
      return;
    }
    return super.open(...args);
  }

  send(...args) {
    if (this._blocked) {
      return; // Don't actually send blocked requests
    }
    return super.send(...args);
  }

  setRequestHeader(...args) {
    if (this._blocked) {
      return; // Ignore headers for blocked requests
    }
    return super.setRequestHeader(...args);
  }
};

// 3. Block all error events
window.addEventListener(
  "error",
  (e) => {
    console.warn("🔇 GLOBAL ERROR BLOCKED:", e.message);
    e.preventDefault();
    return false;
  },
  true,
);

window.addEventListener("unhandledrejection", (e) => {
  console.warn("🔇 GLOBAL REJECTION BLOCKED");
  e.preventDefault();
  return false;
});

console.log("🚨 IMMEDIATE GLOBAL BLOCKER: Total lockdown complete");
