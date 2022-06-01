import React, { useContext } from "react";
import { useStore } from "../zustand/zustandStore";
import { Context } from "../context/store";

export const JoinChat = () => {
	const userCount = useStore((state) => state.userCount);
  const setChat = useStore ((state) => state.setChat)
  const socket = useContext(Context);

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