require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db.js");
const { isActiveRoute } = require("./helpers/routeHelpers");

const app = express();
const PORT = process.env.PORT || 5000; // Corrected this line to properly use process.env

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB,
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  }),
);

// Templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.locals.isActiveRoute = isActiveRoute;

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // Added the port number to the log message
});
