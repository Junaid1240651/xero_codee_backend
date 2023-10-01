const mongoose = require("mongoose");

const userRagistationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const UserRagistation = mongoose.model(
  "UserRagistation",
  userRagistationSchema
);
module.exports = UserRagistation;
