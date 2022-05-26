const mongoose = require("mongoose")

const activeUserSchema = mongoose.Schema({
    socketID: String,
});

const activeUser = mongoose.model('activeUser', activeUserSchema);

module.exports= {activeUser};