import React, { useContext, useEffect } from "react";
import { useStore } from "../zustand/zustandStore";
import { Context } from "../context/store";
import shallow from "zustand/shallow";

export const JoinChat = () => {
	const [userCount, setUserCount] = useStore((state) => [state.userCount, state.setUserCount], shallow);
  const setChat = useStore ((state) => state.setChat)
  const socket = useContext(Context);

  useEffect(()=>{
    socket.on("user_count", (data) => {
      console.log('user count run in join chat')
			setUserCount(data);
		});
  }, [socket, setUserCount])

	const joinChat = async () => {
		if ("geolocation" in navigator) {
			await navigator.geolocation.getCurrentPosition(async (pos) => {
				const location = {
					x: pos.coords.longitude,
					y: pos.coords.latitude,
				};
				await socket.emit("create_chat", location);
				setChat(true);
			});
		} else {
			alert("You location is not available");
		}
	};

	return (
		<div>
			{userCount ? <p>People online {userCount}</p> : null}
			<button onClick={joinChat}>Join chat</button>
		</div>
	);
};