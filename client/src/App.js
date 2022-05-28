import { useContext, useEffect, useState } from "react";
import { Context } from "./context/store";

function App() {
    const [chat, setChat] = useState(false);
    const [msg, setMsg] = useState("");
    const [allMessage, setAllMessage] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);
    const [selfID, setSelfID] = useState(null)
    const [secondUser, setSecondUser] = useState(null)
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
            console.log("got message:", data)
            setAllMessage((prev)=>{
                return [...prev, data]
            })     
        })

        socket.on("chat_room", (data) => {
            setChatRoom(data.room)
            setSelfID(data.socketID)  
        });

        
    }, [socket]);

    useEffect(()=>{
        //if first user, listen for second user
        if(chatRoom && selfID && chatRoom===selfID){
            socket.on("2nd_user", (data)=> {
                setSecondUser(data)
            })
        }
        //else check, if you are the second user yourself in which case your second user is the room which is first user
        else if(chatRoom && selfID && chatRoom!==selfID){
            setSecondUser(chatRoom)
        } 
    }, [chatRoom, socket, selfID])


    const sendMessage = async () => {
        const data = {message: msg, room: chatRoom, owner: selfID}
        await socket.emit("message_send", data);
        setMsg("")
    };

    if (chat) {
        return (
            <div>
                <h1>chat room: {chatRoom}</h1>
                {secondUser? null: <p>waiting for user...</p>}
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <button onClick={sendMessage}>send message</button>
                {allMessage.map((content,index) => { 
                    if(content.owner===selfID){
                        return <p key={index} style={{background:"green"}}>{content.message}</p> 
                    }
                    else{
                        return <p key={index} style={{background:"red"}}>{content.message}</p>
                    }
                })}
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
