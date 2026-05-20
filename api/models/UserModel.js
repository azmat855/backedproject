// ==========================
// models/UserModel.js
// ==========================

const mongoose =require("mongoose");

const UserSchema =
  new mongoose.Schema({
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },
    otp: {
      type: String,
    },
  }, { timestamps: true })


const Users = mongoose.model(
  "Users",
  UserSchema
);

module.exports = Users;