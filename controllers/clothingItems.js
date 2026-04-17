const clothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

// Get /items
const getItem = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => {
      const normalizedItems = items.map((item) => {
        const itemObj = item.toObject();

        if (!Array.isArray(itemObj.likes)) {
          itemObj.likes = [];
        }

        return itemObj;
      });

      return res.send(normalizedItems);
    })
    .catch(next);
};

// Create /items
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Please provide all required fields"));
      } else {
        next(err);
      }
    });
};

// Delete /items/:itemId
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You are not authorized to delete this item");
      }
      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() =>
          res.status(200).send({ message: "Item deleted successfully" })
        );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

// Update /items/:itemId likes
const updateItem = (req, res, next) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Please provide all required fields"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

// Delete /items/:itemId dislikes
const deleteItemDislike = (req, res, next) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      const itemObj = item.toObject();

      if (!Array.isArray(itemObj.likes)) {
        itemObj.likes = [];
      }

      return res.status(200).send(itemObj);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports = {
  getItem,
  createItem,
  deleteItem,
  updateItem,
  deleteItemDislike,
};
