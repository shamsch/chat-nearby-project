import { useEffect, useRef, useState } from "react";
import { useStore } from "../zustand/store";
import shallow from "zustand/shallow";
import { Box, Container } from "@mui/system";
import {
    Button,
    Divider,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./Chat.css";
import { useNavigate } from "react-router-dom";

function Chat() {
    // const [chat, setChat] = useState(false);
    // const [allMessage, setAllMessage] = useState([]);
    // const [userCount, setUserCount] = useState(0);
    //const [chatAlive, setChatAlive] = useState(true);

    //global states
    const [allMessage, setAllMessage, clearAllMessage] = useStore(
        (state) => [
            state.allMessage,
            state.setAllMessage,
            state.clearAllMessage,
        ],
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
    const socket = useStore((state) => state.socket);

    //local state
    const [msg, setMsg] = useState("");
    const [chatRoom, setChatRoom] = useState(null);
    const [selfID, setSelfID] = useState(null);
    const [secondUser, setSecondUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const isTypingRef = useRef();
    const selfIDRef = useRef();
    const secondUserRef = useRef();
    const scrollRef = useRef();

    const navigate = useNavigate();

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

    //scroll into view effect
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessage]);

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

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const handleClick = () => {
        navigate(0);
    };

    const listAllMessage = allMessage.map((content, index) => {
        if (content.owner === selfID) {
            return (
                <ListItem key={index} sx={{ display: "inline-block" }}>
                    <Typography
                        sx={{
                            background: "#F0F8FF",
                            borderRadius: "10% 25%",
                            padding: "15px",
                            float: "right",
                            width: "auto",
                            clear: "right",
                        }}
                    >
                        {content.message}
                    </Typography>
                </ListItem>
            );
        } else {
            return (
                <ListItem key={index} sx={{ display: "inline-block" }}>
                    <ListItemText
                        sx={{
                            borderRadius: "10% 25%",
                            background: "#6CB4EE",
                            padding: "15px",
                            float: "left",
                            width: "auto",
                            clear: "left",
                        }}
                    >
                        {content.message}
                    </ListItemText>
                </ListItem>
            );
        }
    });

    console.log("chat room:", chatRoom);

    return (
        <Container>
            <Paper elevation={5}>
                <Box p={3}>
                    <Typography>
                        Welcome to chat!{" "}
                        {chatAlive && (
                            <Button
                                variant="outlined"
                                color="error"
								size="small"
                                onClick={handleClick}
                            >
                                End chat
                            </Button>
                        )}
                    </Typography>
                    {secondUser ? null : (
                        <Typography>Waiting for user...</Typography>
                    )}
                    {chatAlive ? null : (
                        <Box marginBottom={2}>
                            <Typography>
                                User disconnected, to go back to start{" "}
                                <Button
                                    variant="outlined"
									color="secondary"
									size="small"
                                    onClick={handleClick}
                                >
                                    click here
                                </Button>
                            </Typography>
                        </Box>
                    )}
                    <Divider sx={{marginTop: "10px"}} />
                    {secondUser && (
                        <Grid container spacing={4} alignItems="center">
                            <Grid id="chat-window" xs={12} item>
                                <List id="chat-window-messages">
                                    {listAllMessage}
                                    <ListItem ref={scrollRef}></ListItem>
                                </List>
                            </Grid>
                            <Grid xs={10} item>
                                <FormControl fullWidth>
                                    <TextField
                                        onChange={(e) => handleTyping(e)}
                                        onKeyPress={(e) => handleKeyPress(e)}
                                        value={msg}
                                        label="Start chatting..."
                                        variant="outlined"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={2} item>
                                <IconButton
                                    onClick={sendMessage}
                                    aria-label="send"
                                    color="primary"
                                >
                                    <SendIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    )}
                    {isTyping ? (
                        <Typography fontSize={12} marginLeft={2}>
                            Other user is typing ...{" "}
                        </Typography>
                    ) : null}
                </Box>
            </Paper>
        </Container>
    );
}

export default Chat;
