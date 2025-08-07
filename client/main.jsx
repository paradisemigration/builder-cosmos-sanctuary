import React from "react";
import { createRoot } from "react-dom/client";

// Simple test component to verify no syntax errors
function TestApp() {
  return React.createElement("div", null, 
    React.createElement("h1", null, "App Loading - No Syntax Errors"),
    React.createElement("p", null, "JavaScript version working")
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(React.createElement(TestApp));
}
