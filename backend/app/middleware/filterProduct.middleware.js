const filterProduct = async (req, res, next) => {
  let filter = {};
  const { category, genders, title, price, sort, size } = req.query;

  if (category || genders || title) {
    filter = {
      category,
      genders,
      title: { $regex: new RegExp(title), $options: "i" },
    };

    !category && delete filter.category;
    !genders && delete filter.genders;
    !title && delete filter.title;
  }
  //   price
  if (price) {
    const priceQuery = {
      $or: price.split(",").map((item) => {
        let newItem = item.split("-").map(Number);
        if (newItem.length > 1) {
          newItem = { price: { $gte: newItem[0], $lte: newItem[1] } };
        } else newItem = { price: { $gte: newItem[0] } };
        return newItem;
      }),
    };
    filter = { ...filter, ...priceQuery };
  }

  if (size) {
    filter = {
      ...filter,
      "options.size": { $all: size.split(",").map(Number) },
    };
  }

  let sortQuery = {};
  if (sort) {
    const [type, option] = req.query.sort.split(":");
    sortQuery = { [type]: option === "desc" ? 1 : -1 };
  } else {
    sortQuery = { id: -1 };
  }

  res.locals.sort = sortQuery;
  res.locals.filter = { ...filter };
  next();
};

export default filterProduct;
