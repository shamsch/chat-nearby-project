import io from "socket.io-client"

const SERVER_URL = "http://localhost:3002/"

const socket = io.connect(SERVER_URL)

function App() {
  const joinChat = () => {
    const user = "ROOM1"
    socket.emit("create_chat", user)
  }

  return (
    <div>
      <button onClick={joinChat}>Join chat</button>
    </div>
  );
}

export default App;
