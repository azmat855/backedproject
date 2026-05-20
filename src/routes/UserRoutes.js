// ==========================
// routes/UserRoutes.js
// ==========================

const express = require("express");

const userRoutes =express.Router();

const {getUsersController, updateUserController,} = require("../controllers/UserControllers");

// GET USERS
userRoutes.get("/",getUsersController);

// UPDATE USER
userRoutes.put( "/update", updateUserController
);

module.exports = userRoutes;