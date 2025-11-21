const advancedResults =
  (model, populate, isPrivate = false) =>
  async (req, res, next) => {
    let query;

    // copy req.query
    const reqQuery = { ...req.query };

    if (isPrivate) {
      reqQuery.user = req.user.id;
    }

    // fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // create query string
    let queryStr = JSON.stringify(reqQuery);

    // create operators ($gt, $gte, $lt, $lte)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    // find resource
    query = model.find(JSON.parse(queryStr));

    // select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // sort results
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const total = await model.countDocuments(JSON.parse(queryStr));

    let startIndex, endIndex;

    if (limit) {
      startIndex = (page - 1) * limit;
      endIndex = page * limit;
      query = query.skip(startIndex).limit(limit);
    }

    if (populate) {
      query = query.populate(populate);
    }

    // execute query
    const results = await query;

    // pagination result
    const pagination = {};

    if (limit) {
      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }
    }

    res.advancedResults = {
      success: true,
      count: total,
      pagination,
      data: results,
    };

    next();
  };

const privateAdvancedResults = (model, populate) => {
  return async (req, res, next) => {
    await advancedResults(model, populate, true)(req, res, next);
  };
};

module.exports = { advancedResults, privateAdvancedResults };
