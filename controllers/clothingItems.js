const Item = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// Get /items
const getItem = (req, res) => {
  Item.find({})
    .then((items) => {
      const normalizedItems = items.map((item) => {
        const itemObj = item.toObject();

        if (!Array.isArray(itemObj.dislikes)) {
          itemObj.dislikes = [];
        }

        return itemObj;
      });

      return res.status(200).send(normalizedItems);
    })
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// Create /items
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// Delete /items/:itemId
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// Update /items/:itemId likes
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  Item.findByIdAndUpdate(itemId, { $addToSet: { imageUrl } }, { new: true })
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// Delete /items/:itemId dislikes
const deleteItemDislike = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $pull: { dislikes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      const itemObj = item.toObject();

      if (!Array.isArray(itemObj.dislikes)) {
        itemObj.dislikes = [];
      }

      return res.status(200).send(itemObj);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getItem,
  createItem,
  deleteItem,
  updateItem,
  deleteItemDislike,
};
