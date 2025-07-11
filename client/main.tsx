import React from "react";
import { createRoot } from "react-dom/client";

function SimpleReactApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ color: "blue" }}>✅ React App Working!</h1>
      <p>This proves React is loading correctly.</p>
      <p>URL: {window.location.href}</p>
      <p>Time: {new Date().toLocaleString()}</p>
      <button onClick={() => alert("React onClick working!")}>
        Test React
      </button>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<SimpleReactApp />);
} else {
  document.body.innerHTML = "<h1>Error: No #root element found</h1>";
}
