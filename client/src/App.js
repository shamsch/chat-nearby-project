import { useContext, useEffect, useState } from "react";
import { Context } from "./context/store";

function App() {
    const [chat, setChat] = useState(false);
    const [msg, setMsg] = useState("");
    const [allMessage, setAllMessage] = useState([]);
    const [chatRoom, setChatRoom] = useState("");
    const socket = useContext(Context)

    const joinChat = async () => {
        if ("geolocation" in navigator) {
            await navigator.geolocation.getCurrentPosition( async (pos) => {
                const location = {
                    x: pos.coords.longitude,
                    y: pos.coords.latitude,
                };
                await socket.emit("create_chat", location);
                setChat(true)
            });
        } else {
            alert("You location is not available");
        }
    };


    useEffect(() => {
        socket.on("recieve_message", (data)=>{
            setAllMessage((prev)=>{
                return [...prev, data]
            })     
        })

        socket.on("chat_room", (data) => {
            setChatRoom(data)
        });
    }, [socket]);

    const sendMessage = async () => {
        const data = {message: msg, room: chatRoom}
        await socket.emit("message_send", data);
        setMsg("")
        setAllMessage((prev)=> [...prev, data.message])
    };

    if (chat) {
        return (
            <div>
                <h1>chat room: {chatRoom}</h1>
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <button onClick={sendMessage}>send message</button>
                {allMessage.map((message,index)=> <p key={index}>{message}</p>)}
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