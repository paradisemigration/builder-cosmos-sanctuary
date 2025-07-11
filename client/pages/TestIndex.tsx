export default function TestIndex() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>VisaConsult India - Working!</h1>
      <p>The React app is loading successfully.</p>
      <p>Current URL: {window.location.href}</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}
