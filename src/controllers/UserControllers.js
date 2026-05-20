// ==========================
// controllers/UserControllers.js
// ==========================

const Users = require(
  "../models/UserModel"
);

const jwt = require(
  "jsonwebtoken"
);

// GET USERS
const getUsersController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const users =
        await Users.find();

      res.json({
        status: true,

        message:
          "Users fetched successfully",

        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

// UPDATE USER
const updateUserController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const updatedUser =
        req.body;

      // TOKEN CHECK
      if (
        !req.headers
          .authorization
      ) {
        const error =
          new Error(
            "Token is required"
          );

        error.statusCode = 401;

        return next(error);
      }

      // TOKEN
      const token =
        req.headers.authorization.split(
          " "
        )[1];

      // VERIFY TOKEN
      const decoded =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET
        );

      // UPDATE USER
      await Users.findByIdAndUpdate(
        decoded.userId,
        updatedUser
      );

      res.json({
        status: true,

        message:
          "User updated successfully",
      });
    } catch (error) {
      // INVALID TOKEN
      if (
        error.name ===
        "JsonWebTokenError"
      ) {
        error.message =
          "Invalid Token";

        error.statusCode = 401;
      }

      // TOKEN EXPIRED
      if (
        error.name ===
        "TokenExpiredError"
      ) {
        error.message =
          "Token Expired";

        error.statusCode = 401;
      }

      next(error);
    }
  };

module.exports = {
  getUsersController,
  updateUserController,
};