import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AllRoutes from "./compoents/routes/AllRoutes";
import { BrowserRouter } from "react-router-dom";

const App = () => <AllRoutes />;
export default App;
// const rootElement = document.getElementById("app");
// if (!rootElement) throw new Error("Failed to find the root element");

// const root = ReactDOM.createRoot(rootElement);

// root.render(<App />);
