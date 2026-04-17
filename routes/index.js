const router = require("express").Router();

const userRouter = require("./users");
const NotFoundError = require("../errors/not-found-err");

// Mount users router (protected)
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
