const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { errors } = require("celebrate");
const { validateUser, validateLogin } = require("./middlewares/validation");
const { createUser, login } = require("./controllers/users");
const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

app.use(requestLogger);

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

// Public routes
app.post("/signin", validateLogin, login);
app.post("/signup", validateUser, createUser);

// GET /items (public) by mounting the items router before auth
app.use("/items", require("./routes/clothingItems"));

// Protected routes (users, other routes)
app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
