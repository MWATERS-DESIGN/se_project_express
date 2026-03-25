const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// GET /users/me
router.get("/me", getCurrentUser);

// PATCH /users/me
router.patch("/me", updateUser);

module.exports = router;
