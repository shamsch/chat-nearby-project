import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Context, socket } from "./context/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Context.Provider value={socket}>
        <App />
    </Context.Provider>
);
