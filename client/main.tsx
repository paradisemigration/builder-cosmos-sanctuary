import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          VisaConsult India
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find India's Most Trusted Visa Consultants
        </p>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">✅ Website Restored!</h2>
          <p className="text-gray-600 mb-4">
            Basic routing and styling are working correctly.
          </p>
          <p className="text-sm text-gray-500">URL: {window.location.href}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="*"
          element={
            <div className="p-8 text-center">
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  document.body.innerHTML = "<h1>Error: No #root element found</h1>";
}
