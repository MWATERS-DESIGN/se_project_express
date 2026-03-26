const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.use(auth);

// GET /users/me
router.get("/me", getCurrentUser);

// PATCH /users/me
router.patch("/me", updateUser);

module.exports = router;
