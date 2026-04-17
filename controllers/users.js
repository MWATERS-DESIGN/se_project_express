const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");

const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const { JWT_SECRET } = require("../utils/config");

// Create /users
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password || typeof password !== "string") {
    return next(new BadRequestError("Invalid password"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).json(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Please provide all required fields"));
      }
      return next(err);
    });
};

// Get /users by _id
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

// USER LOGIN
const login = (req, res, next) => {
  const { email, password } = req.body;

  // Missing fields => 400
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  // Invalid email format => 400
  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid email format"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      try {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(200).json({ token });
      } catch (err) {
        return next(err);
      }
    })
    .catch((err) => {
      if (err.name === "AuthError") {
        return next(new UnauthorizedError("Invalid email or password"));
      }
      return next(err);
    });
};

// Update /users/me
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true, context: "query" }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, login, updateUser };
