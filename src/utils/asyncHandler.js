const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    const statusCode =
      typeof error.statusCode === "number" ? error.statusCode : 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({ sucess: false, error: message });
  }
};

export default asyncHandler;
