const messageSend = (io,data) => {
    io.to(data.room).emit("recieve_message", {...data});
}
module.exports={messageSend}