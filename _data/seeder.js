// enviroment variables
require('dotenv').config();

// built-in libs
const fs = require('fs');

// third party libs
require('colors');
const mongoose = require('mongoose');

// load models
const Account = require('../src/models/Account');
const Category = require('../src/models/Category');
const Settings = require('../src/models/Settings');
const Transaction = require('../src/models/Transaction');
const User = require('../src/models/User');

// connect to DB
mongoose.connect(process.env.MONGO_URI);

// read JSON files
const accounts = JSON.parse(
  fs.readFileSync(`${__dirname}/accounts.json`, 'utf-8'),
);
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'),
);
const settings = JSON.parse(
  fs.readFileSync(`${__dirname}/settings.json`, 'utf-8'),
);
const transactionsBobRent = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsBobRent.json`, 'utf-8'),
);
const transactionsBobSalary = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsBobSalary.json`, 'utf-8'),
);
const transactionsJaneRent = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsJaneRent.json`, 'utf-8'),
);
const transactionsJaneSalary = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsJaneSalary.json`, 'utf-8'),
);
const transactionsJohnSalary = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsJohnSalary.json`, 'utf-8'),
);
const transactionsMikeRent = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsMikeRent.json`, 'utf-8'),
);
const transactionsMikeSalary = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsMikeSalary.json`, 'utf-8'),
);
const transactionsParisElectricityBill = JSON.parse(
  fs.readFileSync(
    `${__dirname}/transactionsParisElectricityBill.json`,
    'utf-8',
  ),
);
const transactionsParisExpenses = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsParisExpenses.json`, 'utf-8'),
);
const transactionsParisInstallments = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsParisInstallments.json`, 'utf-8'),
);
const transactionsParisInternetBill = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsParisInternetBill.json`, 'utf-8'),
);
const transactionsParisRent = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsParisRent.json`, 'utf-8'),
);
const transactionsParisSalary = JSON.parse(
  fs.readFileSync(`${__dirname}/transactionsParisSalary.json`, 'utf-8'),
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// import into DB
const importData = async () => {
  try {
    await Account.insertMany(accounts);
    await Category.insertMany(categories);
    await Settings.create(settings);
    await Transaction.insertMany([
      ...transactionsBobRent,
      ...transactionsBobSalary,
      ...transactionsJaneRent,
      ...transactionsJaneSalary,
      ...transactionsJohnSalary,
      ...transactionsMikeRent,
      ...transactionsMikeSalary,
      ...transactionsParisElectricityBill,
      ...transactionsParisExpenses,
      ...transactionsParisInstallments,
      ...transactionsParisInternetBill,
      ...transactionsParisRent,
      ...transactionsParisSalary,
    ]);
    await User.create(users);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// delete data
const deleteData = async () => {
  try {
    await Account.deleteMany();
    await Category.deleteMany();
    await Settings.deleteMany();
    await Transaction.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  process.exit();
}
