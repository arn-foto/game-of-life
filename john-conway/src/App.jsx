import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Grid from "./components/Grid";
import "./css/index.css";

export default function App() {
  return (
    <Router>
      <div className="grid">
        <Grid />
      </div>
    </Router>
  );
}
