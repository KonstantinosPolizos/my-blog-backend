const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

module.exports = asyncHandler(async (req, res, next) => {
  var authHeader = req.headers.authorization;

  if (authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        res.status(401);
        throw new Error("Not Authorized");
      }
      req.user = decoded.user;
      next();
    });
  }
});
