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


const updateXY = async (user, newUser) => {
    console.log(newUser)
    const foundUser = await activeUser.findOne(user).updateOne(newUser)
    console.log("found user", foundUser)
}

const getUsers = async () => {
    try{
        const users = await activeUser.find();
        return users; 
    }catch( error ){
       console.log("Error getting user in controller", error.message)
    }
}


module.exports = { addUser, deleteUser, updateXY, getUsers };
