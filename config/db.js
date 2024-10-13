const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Database connecte");
  } catch (error) {
    console.log("Database connecteion Error" + error);
  }
};
module.exports = connectDB;
