import { useStore } from "./zustand/zustandStore";
import { Navigate, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import { StartChatPage } from "./pages/StartChatPage";

function App() {
	const chat = useStore((state) => state.chat);

	return (
			<Routes>
				<Route
					path="/"
					element={chat ? <Navigate to="/chat" /> : <Navigate to="/start" />}
				/>
				<Route
					path="/start"
					element={chat ? <Navigate to="/chat" /> : <StartChatPage />}
				/>
				<Route
					path="/chat"
					element={chat ? <ChatPage /> : <Navigate to="/start" />}
				/>
			</Routes>
	);
}

export default App;
