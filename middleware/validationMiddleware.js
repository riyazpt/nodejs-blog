const validationMiddleware = (validationFn) => {
  return (req, res, next) => {
    const { error } = validationFn(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = validationMiddleware;
