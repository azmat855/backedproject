const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

// ROUTES
const authRoutes = require("./routes/AuthRoutes");

const userRoutes = require("./routes/UserRoutes");

// MIDDLEWARE
const errorHandler = require("./middlewares/errorHandler");

// DATABASE CONNECTION
async function connectToDatabase() {
  try {
    console.log("Connecting to database...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log(
      "Database connected successfully"
    );
  } catch (error) {
    console.log(
      "Database Error:",
      error
    );
  }
}

connectToDatabase();

// ROUTES
app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/v1/users",
  userRoutes
);

// HEALTH ROUTE
app.get(
  "/health",
  function (req, res) {
    res.json({
      status: true,
      message:
        "Backend is working properly",
    });
  }
);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

// SERVER
const PORT = process.env.PORT;

if(false){
app.listen(PORT, function () {
  console.log(
    `Server is running on port ${PORT}`
  );
})
}

module.exports = app;