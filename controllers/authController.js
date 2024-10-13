const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");

const jwtSecret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.render("admin/register", {
      layout: "../views/layouts/admin",
      errorMessage: error.details[0].message,
      currentRoute: "/register",
    });
  }

  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.render("admin/index", {
      locals: {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb.",
      },
      currentRoute: "/admin",
      errorMessage: error.details[0].message,
    });
  }

  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("admin/index", {
      locals: {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb.",
      },
      currentRoute: "/admin",
      errorMessage: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.render("admin/index", {
      locals: {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb.",
      },
      currentRoute: "/admin",
      errorMessage: "Invalid credentials",
    });
  }

  const token = jwt.sign({ userId: user._id }, jwtSecret);
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/dashboard");
};

module.exports = {
  registerUser,
  loginUser,
};
