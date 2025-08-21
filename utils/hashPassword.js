const bcrypt=require("bcrypt")

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return reject(new Error("Error generating salt: " + err.message));

      bcrypt.hash(password, salt, (err, hashed) => {
        if (err)
          return reject(new Error("Error hashing password: " + err.message));
        resolve(hashed);
      });
    });
  });
};

module.exports = hashPassword;