import { useEffect, useRef, useState } from "react";
import { useStore } from "../zustand/store";
import shallow from "zustand/shallow";

function Chat() {
	// const [chat, setChat] = useState(false);
	// const [allMessage, setAllMessage] = useState([]);
	// const [userCount, setUserCount] = useState(0);
	//const [chatAlive, setChatAlive] = useState(true);

	//global states
	const [allMessage, setAllMessage, clearAllMessage] = useStore(
		(state) => [state.allMessage, state.setAllMessage, state.clearAllMessage],
		shallow
	);
	const [chat, setChat] = useStore(
		(state) => [state.chat, state.setChat],
		shallow
	);
	const [userCount, setUserCount] = useStore(
		(state) => [state.userCount, state.setUserCount],
		shallow
	);
	const [chatAlive, setChatAlive] = useStore(
		(state) => [state.chatAlive, state.setChatAlive],
		shallow
	);
	const socket = useStore((state)=> state.socket);

	//local state
	const [msg, setMsg] = useState("");
	const [chatRoom, setChatRoom] = useState(null);
	const [selfID, setSelfID] = useState(null);
	const [secondUser, setSecondUser] = useState(null);
	const [isTyping, setIsTyping] = useState(false);

	const isTypingRef = useRef();
	const selfIDRef = useRef();
	const secondUserRef = useRef();
	

	useEffect(() => {
		socket.on("recieve_message", (data) => {
			console.log("got message:", data);
			setAllMessage(data);

			//on getting a message
			setIsTyping(false);
			isTypingRef.current = false;
		});

		socket.on("chat_room", (data) => {
			setChatRoom(data.room);
			setSelfID(data.socketID);
			selfIDRef.current = data.socketID;
		});

		socket.on("other_typing", (data) => {
			console.log("got run", data.user !== selfIDRef.current);

			if (data.user !== selfIDRef.current) {
				if (data.typing && !isTypingRef.current) {
					setIsTyping(true);
					isTypingRef.current = true;
				} else if (!data.typing && isTypingRef.current) {
					setIsTyping(false);
					isTypingRef.current = false;
				}
			}
		});

		socket.on("user_disconnect", (data) => {
			if (data === secondUserRef.current) {
				setChatAlive(false);
			}
		});

		socket.on("user_count", (data) => {
			setUserCount(data);
		});
	}, [socket, setAllMessage, setUserCount, setChatAlive]);

	useEffect(() => {
		//if first user, listen for second user
		if (chatRoom && selfID && chatRoom === selfID) {
			socket.on("2nd_user", (data) => {
				setSecondUser(data);
				secondUserRef.current = data;
			});
		}
		//else check, if you are the second user yourself in which case your second user is the room which is first user
		else if (chatRoom && selfID && chatRoom !== selfID) {
			setSecondUser(chatRoom);
			secondUserRef.current = chatRoom;
		}
	}, [chatRoom, socket, selfID]);

	const sendMessage = async () => {
		const data = { message: msg, room: chatRoom, owner: selfID };
		await socket.emit("message_send", data);
		setMsg("");
	};

	const handleTyping = (e) => {
		setMsg(e.target.value);
		const data = {
			room: chatRoom,
			user: selfID,
			typing: e.target.value.length > 0,
		};
		socket.emit("self_typing", data);
	};

  const handleClick = () => {
    setChat(false)
    setChatAlive(true)
	clearAllMessage()
  }
 

	return (
		<div>
			<h1>chat room: {chatRoom}</h1>
			{userCount ? <p>People online {userCount}</p> : null}
			{secondUser ? null : <p>Waiting for user...</p>}
			{chatAlive ? null : (
				<div>
					user disconnected, to go back to start{" "}
					<button onClick={handleClick}>click here</button>
				</div>
			)}
			{isTyping ? <p>Other user is typing ... </p> : null}
			<input type="text" value={msg} onChange={(e) => handleTyping(e)} />
			<button onClick={sendMessage}>send message</button>
			{allMessage.map((content, index) => {
				if (content.owner === selfID) {
					return (
						<p key={index} style={{ background: "green" }}>
							{content.message}
						</p>
					);
				} else {
					return (
						<p key={index} style={{ background: "red" }}>
							{content.message}
						</p>
					);
				}
			})}
		</div>
	);
}

export default Chat;
