let users = [];

// JOIN USER TO CHAT
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

// GET CURRENT USER
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// USER LEAVES THE CHAT
const userLeave = (id) => {
  const user = users.find((user) => user.id === id);
  const updatedUsers = users.filter((user) => user.id !== id);
  users = [...updatedUsers];
  return user;
};

// TO GET ROOM USERS
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
