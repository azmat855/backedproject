// ==========================
// middlewares/errorHandler.js
// ==========================

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.log(
    "Global Error:",
    err
  );

  res
    .status(
      err.statusCode || 500
    )
    .json({
      status: false,

      message:
        err.message ||
        "Internal Server Error",
    });
};

module.exports =
  errorHandler;