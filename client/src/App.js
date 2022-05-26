import { useState } from "react";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:3002/";

const socket = io.connect(SERVER_URL);

function App() {
    const [location, setLocation] = useState(null);

    const joinChat = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const location = {
                    x: pos.coords.longitude,
                    y: pos.coords.latitude,
                };
                setLocation(location);
            });
        } else {
            alert("You location is not available");
        }
        
        if (location) {
            socket.emit("create_chat", location);
        }
    };

    return (
        <div>
            <button onClick={joinChat}>Join chat</button>
        </div>
    );
}

export default App;
