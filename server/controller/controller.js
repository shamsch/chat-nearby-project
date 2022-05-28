const { activeUser, busyUser } = require("../model/schema");

const addUser = async (user) => {
    const newUser = new activeUser(user);
    try {
        const user = await newUser.save();
        console.log("User added", user);
    } catch (err) {
        console.log("Error saving user:", err);
    }
    return user;
};

const deleteUser = async (user) => {
    try {
        const deleted = await activeUser.deleteOne(user);
        console.log("User deleted", deleted.deletedCount);
    } catch (error) {
        console.log("Error deleting: ", error);
    }
};


const getAnActiveUser = async (socket) => {
    const {socketID,x,y} = await activeUser.findOne({socketID: socket});
    return {socketID, x, y};
}


const updateXY = async (user, newUser) => {
    const foundUser = await activeUser.findOne(user).updateOne(newUser)
}

const getUsers = async () => {
    try{
        const users = await activeUser.find();
        return users; 
    }catch( error ){
       console.log("Error getting user in controller", error.message)
    }
}

const addUserToBusy = async (user) => {
    const newUser = new busyUser(user);
    try {
        const user = await newUser.save();
        console.log("Moved user to busy", user);
    } catch (err) {
        console.log("Error moving user to busy:", err);
    }
    return user;
};

const deleteUserFromBusy = async (user) => {
    try {
        const deleted = await busyUser.deleteOne(user);
        console.log("Deleted user from busy users", deleted.deletedCount);
    } catch (error) {
        console.log("Error deleting from busy user: ", error);
    }
};

module.exports = { addUser, deleteUser, updateXY, getUsers, addUserToBusy, deleteUserFromBusy, getAnActiveUser};
