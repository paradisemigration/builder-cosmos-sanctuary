// Absolute minimal test - no imports that could fail
const root = document.getElementById("root");
if (root) {
  root.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1 style="color: green;">✅ Basic HTML/JS Working!</h1>
      <p>This proves the server is serving files correctly.</p>
      <p>URL: ${window.location.href}</p>
      <p>Time: ${new Date().toLocaleString()}</p>
      <button onclick="alert('JavaScript is working!')">Test JS</button>
    </div>
  `;
} else {
  document.body.innerHTML = "<h1>Error: No #root element found</h1>";
}
