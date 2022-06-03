const { addUser } = require("../controller/controller");

const onConnection = (socket, userCount) => {
    const user = {
		socketID: socket.id,
		x: "0",
		y: "0",
	};

	addUser(user);
	newUserCount = userCount+1;

    return {user, newUserCount};
}

module.exports = {onConnection}