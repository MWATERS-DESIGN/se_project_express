const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItem,
  createItem,
  deleteItem,
  updateItem,
  deleteItemDislike,
} = require("../controllers/clothingItems");

// Public: GET /items
router.get("/", getItem);

// Protect all subsequent routes with auth middleware (returns 401 on failure)
router.use(auth);

// Protected routes
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", updateItem);
router.delete("/:itemId/likes", deleteItemDislike);

module.exports = router;
