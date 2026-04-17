const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length for "name" is 2',
      "string.max": 'The maximum length for "name" is 30',
      "string.empty": 'The "name" field is required.',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field is required.',
      "string.uri": 'The "imageUrl" field must be a valid URL.',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": 'The "weather" field is required.',
      "any.only":
        'The "weather" field must be one of the following values: hot, warm, cold.',
    }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length for "name" is 2',
      "string.max": 'The maximum length for "name" is 30',
      "string.empty": 'The "name" field is required.',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field is required.',
      "string.uri": 'The "avatar" field must be a valid URL.',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required.',
      "string.email": 'The "email" field must be a valid email address.',
    }),
    password: Joi.string().required().min(6).messages({
      "string.empty": 'The "password" field is required.',
      "string.min": 'The minimum length for "password" is 6',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field is required.',
      "string.email": 'The "email" field must be a valid email address.',
    }),
    password: Joi.string().required().min(6).messages({
      "string.empty": 'The "password" field is required.',
      "string.min": 'The minimum length for "password" is 6',
    }),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
      }),
      avatar: Joi.string().custom(validateURL).messages({
        "string.empty": 'The "avatar" field cannot be empty.',
        "string.uri": 'The "avatar" field must be a valid url',
      }),
    })
    .min(1)
    .messages({
      "object.min": "At least one field (name or avatar) must be provided",
    }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24).messages({
      "string.empty": 'The "userId" field is required.',
      "string.hex": 'The "userId" field must be a valid hex string.',
      "string.length": 'The "userId" field must be 24 characters long.',
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": 'The "itemId" field is required.',
      "string.hex": 'The "itemId" field must be a valid hex string.',
      "string.length": 'The "itemId" field must be 24 characters long.',
    }),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateUserId,
  validateItemId,
  validateClothingItem,
  validateUpdateUser,
};
