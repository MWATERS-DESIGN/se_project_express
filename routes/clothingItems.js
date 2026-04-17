const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItem,
  createItem,
  deleteItem,
  updateItem,
  deleteItemDislike,
} = require("../controllers/clothingItems");
const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");

// Public: GET /items
router.get("/", getItem);

// Protect all subsequent routes with auth middleware (returns 401 on failure)
router.use(auth);

// Protected routes
router.post("/", validateClothingItem, createItem);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, updateItem);
router.delete("/:itemId/likes", validateItemId, deleteItemDislike);

module.exports = router;
