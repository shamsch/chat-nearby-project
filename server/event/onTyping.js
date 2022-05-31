const onTyping = (io, data) => {
    io.to(data.room).emit("other_typing", data);
}

module.exports = {onTyping}