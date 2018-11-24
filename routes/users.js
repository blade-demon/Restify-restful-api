const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const auth = require("../auth");

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
      const user = await auth.authentication(email, password);
      console.log(user);
      res.send(200);
    } catch (error) {
      return next(new errors.UnauthorizedError(error));
    }
  });
};
