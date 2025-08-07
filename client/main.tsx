import React from "react";
import { createRoot } from "react-dom/client";

// Simple fallback component
function SimpleApp() {
  return (
    <div>
      <h1>App Loading...</h1>
      <p>If you see this, the syntax error has been resolved.</p>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<SimpleApp />);
}
