const { deleteUser, deleteUserFromBusy } = require("../controller/controller");

const onDisconnect = (io, socket, user, userCount) => {
	//delete user from either document if it exists upon disconnecting
	deleteUser({ socketID: user.socketID });
	deleteUserFromBusy({ socketID: user.socketID });

	io.emit("user_disconnect", socket.id);

    newUserCount = userCount-1; 

	console.log("user disconnected", socket.id);

    return newUserCount; 
};

module.exports = {onDisconnect}
