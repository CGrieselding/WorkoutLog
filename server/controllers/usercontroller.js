const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const User = require("../models/user");

router.post("/register", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    let User = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, 15)
    });

    let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    // res.send('This is our user/register endpoint!')
    res.status(201).json({
      message: "User successfully registered.",
      user: User,
      sessionToken: token,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Username already in use.",
      });
    } else {
      res.status(500).json({
        message: "Failed to register user.",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    let loginUser = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (loginUser) {
      let comparePasswords = await bcrypt.compare(password, loginUser.password);

      if (comparePasswords) {
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.status(200).json({
          user: loginUser,
          message: "User successfully logged in.",
          sessionToken: token,
        });
      } else {
        res.status(401).json({
          message: "Incorrect email or password.",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "User failed to log in.",
    });
  }
});

module.exports = router;
