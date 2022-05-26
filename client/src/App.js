import { useState } from "react";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:3002/";

const socket = io.connect(SERVER_URL);

function App() {
    const [chat, setChat] = useState(false);
    const [msg, setMsg] = useState("");

    const joinChat = async () => {
        if ("geolocation" in navigator) {
            await navigator.geolocation.getCurrentPosition((pos) => {
                const location = {
                    x: pos.coords.longitude,
                    y: pos.coords.latitude,
                };
                socket.emit("create_chat", location);
                setChat(true);
            });
        } else {
            alert("You location is not available");
        }
    };

    const sendMessage = async () => {
        await socket.emit("message_send", msg)
    };

    if (chat) {
        return (
            <div>
                <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                <button onClick={sendMessage}>send message</button>
            </div>
        );
    }
    return (
        <div>
            <button onClick={joinChat}>Join chat</button>
        </div>
    );
}

export default App;
