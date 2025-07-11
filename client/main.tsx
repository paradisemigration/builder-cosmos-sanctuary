import { createRoot } from "react-dom/client";
import App from "./App";
import SimpleApp from "./App.test";

// Use simple test app to debug, then switch back to full app
createRoot(document.getElementById("root")!).render(<SimpleApp />);
