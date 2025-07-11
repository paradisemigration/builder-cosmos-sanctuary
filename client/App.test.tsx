import "./global.css";
import { createRoot } from "react-dom/client";

function SimpleApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>VisaConsult India - Test Page</h1>
      <p>If you can see this, the basic React app is working!</p>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f0f8ff",
          border: "1px solid #0066cc",
        }}
      >
        <h3>Debug Info:</h3>
        <p>URL: {window.location.href}</p>
        <p>Hostname: {window.location.hostname}</p>
        <p>Port: {window.location.port}</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default SimpleApp;
