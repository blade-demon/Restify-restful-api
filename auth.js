const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");

exports.authentication = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get user by email
      const user = await User.findOne({ email });

      // match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          resolve(user);
        } else {
          reject("Authentication Failed");
        }
      });
    } catch (error) {
      reject("Authentication Failed");
    }
  });
};
