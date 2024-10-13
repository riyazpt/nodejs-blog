const Joi = require("joi");

const searchPostValidation = (data) => {
  const schema = Joi.object({
    searchTerm: Joi.string().min(1).required().messages({
      "string.empty": "Search term cannot be empty",
      "string.min": "Search term should be at least 1 character",
    }),
  });

  return schema.validate(data);
};
const postValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    body: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

module.exports = {
  searchPostValidation,
  postValidation,
};
