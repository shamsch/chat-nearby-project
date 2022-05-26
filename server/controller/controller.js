const { activeUser } = require("../model/schema");

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

module.exports = { addUser, deleteUser };
