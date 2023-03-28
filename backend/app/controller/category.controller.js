import Category from "../models/category.model.js";
import responseHandler from "../handler/response.handler.js";

export const create = async (req, res) => {
  try {
    const category = await Category.findOne(req.body);
    if (category)
      return responseHandler.badrequest(res, "Category name already used");

    await Category.create(req.body);
    responseHandler.ok(res, {});
  } catch {
    responseHandler.error(res);
  }
};

export const getAll = async (req, res) => {
  try {
    const categories = await Category.find(req.query);
    const genders = ["men", "women", "boys", "girls"].reduce((cur, gender) => {
      const children = categories
        .map((category) => {
          return (
            category.genders.includes(gender) && {
              name: category.name,
              slug: category.slug,
            }
          );
        })
        .filter((category) => category);
      return [...cur, { name: gender, children }];
    }, []);

    responseHandler.ok(res, { categories, genders });
  } catch {
    responseHandler.error(res);
  }
};

export const updateOne = async (req, res) => {
  try {
    Category.findByIdAndUpdate(req.params.id, req.body)
      .then(() => responseHandler.ok(res))
      .catch(() => responseHandler.notfound(res));
  } catch {
    responseHandler.error(res);
  }
};

export const deleteOne = async (req, res) => {
  try {
    Category.findByIdAndDelete(req.params.id)
      .then(() => responseHandler.ok(res))
      .catch(() => responseHandler.notfound(res));
  } catch {
    responseHandler.error(res);
  }
};

export const search = async (req, res) => {
  try {
    const categories = await Category.find({
      name: { $regex: new RegExp(req.query.q), $options: "i" },
    }).sort({ _id: 1 });
    responseHandler.ok(res, { categories });
  } catch {
    responseHandler.error(res);
  }
};
