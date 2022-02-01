const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { formatMessage } = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketio(server);

const botName = "Chat Bot";

// RUNS WHEN CLIENT CONNECTS
io.on("connection", (socket) => {
  // RUN WHEN USER JOIN ROOM - LISTENING EVENT
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //   WELCOME CURRENT USER
    socket.emit("message", formatMessage(botName, `Welcome to Chat ${user.username}!`));

    //   BROADCAST TO ALL USERS OTHER THAN THE ONE CONNECTED
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // SEND USERS AND ROOM INFO
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //   LISTEN FOR CHAT MESSAGE
  socket.on("chatMessage", (msg) => {
    // console.log(msg);
    const user = getCurrentUser(socket.id);

    // TO EMIT MESSAGE TO EVERYONE
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //   RUNS WHEN CLIENT DISCONNECTS
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit(
        "message",
        formatMessage(botName, `${user?.username} has left the chat.`)
      );

      // SEND USERS AND ROOM INFO
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });


    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
