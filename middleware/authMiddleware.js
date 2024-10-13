const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // Render an EJS page with an error message
    const locals = {
      title: "Unauthorized Access",
      errorMessage: "You must be logged in to access this page.",
    };
    return res.render("error", { locals, layout: "../views/layouts/admin" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    const locals = {
      title: "Unauthorized Access",
      errorMessage: "Invalid token. Please log in again." + err,
    };
    return res.render("error", { locals, layout: "../views/layouts/admin" });
  }
};

module.exports = authMiddleware;
