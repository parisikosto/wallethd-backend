const slugify = require('slugify');

const {
  mainCategories,
  subCategories,
} = require('../config/defaultCategories');
const Category = require('../models/Category');
const Settings = require('../models/Settings');

const createUserDefaults = async (userId) => {
  /**
   * create user default settings
   */
  const existingSettings = await Settings.findOne({ user: userId });
  if (!existingSettings) {
    await Settings.create({ user: userId });
  }

  /**
   * create user default categories and subcategories
   */
  // avoid reseeding if user already has categories
  const existingCategories = await Category.countDocuments({ user: userId });
  if (existingCategories > 0) {
    return;
  }

  // add main categories
  const mainCategoriesDocs = mainCategories.map(
    ({ name, transactionType, description, order }) => ({
      user: userId,
      name,
      transactionType,
      description: description || '',
      order,
      slug: slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      }),
    }),
  );

  const createdMainCategories = await Category.insertMany(mainCategoriesDocs);

  const keyToId = {};
  for (let i = 0; i < mainCategories.length; i++) {
    keyToId[mainCategories[i].key] = createdMainCategories[i]._id;
  }

  // add subcategories
  const subCategoriesDocs = subCategories.map(
    ({ name, transactionType, description, order, parentKey }) => ({
      user: userId,
      name,
      transactionType,
      parent: keyToId[parentKey],
      description: description || '',
      order,
      slug: slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      }),
    }),
  );

  await Category.insertMany(subCategoriesDocs);
};

module.exports = { createUserDefaults };
