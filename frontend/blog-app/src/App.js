import React from "react";
import "./App.css";

/**
 * @return {JDX.Element}
 * Render the main application component.
 */
function App() {
  const msg = "Hello, world!";
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to my React App</h1>
        <p>{msg}</p>
      </header>
    </div>
  );
}

export default App;
