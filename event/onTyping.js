const onTyping = (io, data) => {
    console.log("typing...", data.typing)
    io.to(data.room).emit("other_typing", data);
}

module.exports = {onTyping}