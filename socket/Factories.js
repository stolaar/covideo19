const { v4 } = require("uuid");

const createUser = ({ name = "", socketId = null } = {}) => ({
  id: v4(),
  name,
  socketId
});

module.exports = {
  createUser
};
