const { updateXY, deleteUser, addUserToBusy, getAnActiveUser } = require("../controller/controller");
const { findAvailableUser } = require("../logic/findAvailableUser");

const createChat = async (socket, data, user) => {
    const userWithLocation = {
        ...user,
        ...data,
    };
    await updateXY(user, userWithLocation);
    
    //which room to put user 
    const userNearBy = await findAvailableUser(userWithLocation);
    const room = userNearBy.length
        ? userNearBy[0].socketID //already created room by first user
        : userWithLocation.socketID; //new room as first user
    // console.log("room", room);
   
    //move both users from active to busy if it's the second user entering the room
    //inform first user that he is connected to second user
    if(room!=userWithLocation.socketID){
        //2nd user who just entered the room
        await deleteUser({ socketID: user.socketID });
        await addUserToBusy(userWithLocation);
        //first user who is already in the room and has same socket id as the room name
        //first get the user from active user collection 
        const firstUser = await getAnActiveUser(room);
        await deleteUser({ socketID: room });
        await addUserToBusy(firstUser);

        //emitting to first user that second user is online 
        socket.to(room).emit("2nd_user", userWithLocation.socketID)
    }

    socket.join(room);
    await socket.emit("chat_room", {room, ...userWithLocation});
}

module.exports = {createChat}