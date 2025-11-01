// enviroment variables
require("dotenv").config();

// built-in libs
const fs = require("fs");

// third party libs
require("colors");
const mongoose = require("mongoose");

// load models
const User = require("../src/models/User");

// connect to DB
mongoose.connect(process.env.MONGO_URI);

// read JSON files
/** users */
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

// import into DB
const importData = async () => {
  try {
    await User.create(users);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// delete data
const deleteData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  process.exit();
}