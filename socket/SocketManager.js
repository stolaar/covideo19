const {
  LOGOUT,
  USER_CONNECTED,
  USER_DISCONNECTED,
  VERIFY_USER,
  CALL_USER,
  CALL_MADE,
  MAKE_ANSWER,
  ANSWER_MADE
} = require("./events");
const io = require("../server").io;
let connectedUsers = {};

const { createUser } = require("./Factories.js");

module.exports = socket => {
  console.log("Connected");
  io.emit("client_connected", "Welcome");

  console.log("Socket id ", socket.id);

  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({
        isUser: false,
        user: createUser({ name: nickname, socketId: socket.id })
      });
    }
  });

  socket.on(USER_CONNECTED, user => {
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  socket.on(CALL_USER, data => {
    socket.to(data.to).emit(CALL_MADE, {
      offer: data.offer,
      socket: socket.id
    });
  });

  socket.on(MAKE_ANSWER, data => {
    socket.to(data.to).emit(ANSWER_MADE, {
      socket: socket.id,
      answer: data.answer,
      user: socket.user
    });
  });
  // socket.on(ANSWER_MADE, async (data, callUser) => {
  //   await peerConnection.setRemoteDescription(
  //     new RTCSessionDescription(data.answer)
  //   );
  //   let isAlreadyCalling;
  //   if (!isAlreadyCalling) {
  //     callUser(data.socket);
  //     isAlreadyCalling = true;
  //   }
  // });

  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);

      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log("Disconnect", connectedUsers);
    }
  });

  //User logsout
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log("Disconnect", connectedUsers);
  });
};

const isUser = (userList, username) => {
  return username in userList;
};

const removeUser = (userList, username) => {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
};

const addUser = (userList, user) => {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
};
