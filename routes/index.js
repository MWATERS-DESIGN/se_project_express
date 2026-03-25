const router = require("express").Router();

const userRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");

// Mount users router (protected)
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
