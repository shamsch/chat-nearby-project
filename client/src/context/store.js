import { createContext } from "react";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:3002/";
export const socket = io.connect(SERVER_URL);
export const Context = createContext();
