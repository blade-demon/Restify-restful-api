const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../auth");
const config = require("../config");

module.exports = server => {
  // Register user
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, async (error, hash) => {
        // Hash password
        user.password = hash;
        // Save user
        try {
          const newUser = await user.save();
          res.send(201);
        } catch (error) {
          return next(new errors.InternalError(error.message));
        }
      });
    });
  });

  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // Authenticate user
      const user = await auth.authentication(email, password);

      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "15m"
      });

      const { iat, exp } = jwt.decode(token);
      res.send({ iat, exp, token });

      res.send(200);
    } catch (error) {
      return next(new errors.UnauthorizedError(error));
    }
  });
};
