import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Context, socket } from "./context/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<Context.Provider value={socket}>
			<App />
		</Context.Provider>
	</BrowserRouter>
);
