import React, { useEffect } from "react";
import { useStore } from "../zustand/store";
import shallow from "zustand/shallow";
import { Button, Grid } from "@mui/material";
import Description from "./Description";

export const JoinChat = () => {
    const [userCount, setUserCount] = useStore(
        (state) => [state.userCount, state.setUserCount],
        shallow
    );
    const setChat = useStore((state) => state.setChat);
    const socket = useStore((state) => state.socket);

    useEffect(() => {
        socket.on("user_count", (data) => {
            console.log("user count run in join chat");
            setUserCount(data);
        });
    }, [socket, setUserCount]);

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
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
        >
            <Grid item xs="auto" marginBottom="30px">
                <Description />
            </Grid>
            <Grid>
                <Button variant="contained" onClick={joinChat}>
                    Start chat
                </Button>
            </Grid>
        </Grid>
    );
};
