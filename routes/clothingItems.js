const router = require("express").Router();
const {
  getItem,
  createItem,
  deleteItem,
  updateItem,
  deleteItemDislike,
} = require("../controllers/clothingItems");

router.get("/", getItem);

router.post("/", createItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", updateItem);

router.delete("/:itemId/likes", deleteItemDislike);

module.exports = router;
