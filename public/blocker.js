// IMMEDIATE GLOBAL BLOCKER - RUNS BEFORE EVERYTHING ELSE
console.log('🚨 IMMEDIATE GLOBAL BLOCKER: Starting total lockdown');

// Block all possible request sources immediately
const hostname = window.location.hostname;

// 1. Override fetch globally
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const url = args[0]?.toString() || '';
  if (url.includes('/api/') || (url.includes('://') && !url.includes(hostname))) {
    console.error('🚨 GLOBAL BLOCKED:', url);
    return Promise.resolve(new Response('{"blocked":true}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
  return originalFetch(...args);
};

// 2. Override XMLHttpRequest
const OriginalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = class extends OriginalXHR {
  open(...args) {
    const url = args[1]?.toString() || '';
    if (url.includes('/api/') || (url.includes('://') && !url.includes(hostname))) {
      console.error('🚨 XHR BLOCKED:', url);
      setTimeout(() => {
        Object.defineProperty(this, 'status', { value: 200 });
        Object.defineProperty(this, 'responseText', { value: '{}' });
        if (this.onload) this.onload(new Event('load'));
      }, 0);
      return;
    }
    return super.open(...args);
  }
};

// 3. Block all error events
window.addEventListener('error', (e) => { 
  console.warn('🔇 GLOBAL ERROR BLOCKED:', e.message); 
  e.preventDefault(); 
  return false; 
}, true);

window.addEventListener('unhandledrejection', (e) => { 
  console.warn('🔇 GLOBAL REJECTION BLOCKED'); 
  e.preventDefault(); 
  return false; 
});

console.log('🚨 IMMEDIATE GLOBAL BLOCKER: Total lockdown complete');
