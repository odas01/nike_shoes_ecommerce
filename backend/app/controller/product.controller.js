import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Gallery from "../models/gallery.model.js";
import CartItem from "../models/cartItem.model.js";
import OrderDetail from "../models/orderDetail.model.js";

import responseHandler from "../handler/response.handler.js";

import {
  uploadMultiple,
  uploadSingle,
  destroySingle,
  destroyMultiple,
} from "../middleware/images.middleware.js";

export const create = async (req, res) => {
  const newValue = req.body;
  try {
    let thumbnailRes, imagesRes;
    let images = [];

    if (newValue.thumbnail) {
      thumbnailRes = await uploadSingle(newValue.thumbnail.thumbUrl);
    }

    if (newValue.images) {
      imagesRes = await uploadMultiple(
        newValue.images.map((image) => image.url)
      );

      for (const imageRes of imagesRes) {
        const { _id } = await Gallery.create({
          public_id: imageRes.public_id,
          url: imageRes.url,
          format: imageRes.format,
          type: "product",
        });
        images.push(_id);
      }
    }

    await Product.create({
      ...newValue,
      thumbnail: {
        public_id: thumbnailRes.public_id,
        url: thumbnailRes.url,
      },
      images,
    });
    responseHandler.created(res, {});
  } catch {
    responseHandler.error(res);
  }
};

export const getAll = async (req, res) => {
  // skip / limit
  const skip = req.query.skip;
  const limit = req.query.limit;

  try {
    const total = await Product.countDocuments(res.locals.filter);

    const page = skip / limit + 1 || 1;
    const lastPage = Math.ceil(total / limit) || 1;

    const products = await Product.find(res.locals.filter)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate("images");

    responseHandler.ok(res, { products, total, page, lastPage });
  } catch {
    responseHandler.error(res);
  }
};

export const getOne = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug }).populate("images");
    const category = await Category.findOne({ name: product.category }).select(
      "name slug -_id"
    );

    responseHandler.ok(res, { product: { ...product._doc, category } });
  } catch {
    responseHandler.error(res);
  }
};

export const updateOne = async (req, res) => {
  const { slug } = req.params;
  const values = req.body;
  try {
    const oldProduct = await Product.findOne({ slug }).populate("images");

    if (values.thumbnail?.thumbUrl) {
      await destroySingle(oldProduct.thumbnail.public_id);
      const thumbnailRes = await uploadSingle(values.thumbnail.thumbUrl);
      values.thumbnail = {
        public_id: thumbnailRes.public_id,
        url: thumbnailRes.url,
      };
    }
    if (values.images) {
      // remove old image
      for (const image of oldProduct.images) {
        const exist = values.images.some((x) => x.url === image.url);
        if (!exist) {
          await destroySingle(image.public_id);
          await Gallery.findByIdAndDelete(image._id);
          await Product.updateOne(
            { slug },
            {
              $pull: { images: image._id },
            }
          );
        }
      }

      // cretae new image
      for (const image of values.images) {
        const exist = oldProduct.images.some((x) => x.url === image.url);
        if (!exist) {
          const imageRes = await uploadSingle(image.url);
          const { _id } = await Gallery.create({
            public_id: imageRes.public_id,
            url: imageRes.url,
            format: imageRes.format,
            type: "product",
          });
          await Product.updateOne(
            { slug },
            {
              $push: { images: _id },
            },
            { new: true, update: true }
          );
        }
      }

      delete values.images;
    }

    const product = await Product.findOneAndUpdate({ slug }, values, {
      new: true,
      update: true,
    }).populate("images");

    responseHandler.ok(res, { product });
  } catch {
    responseHandler.error(res);
  }
};

export const deleteOne = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug }).populate("images");

    if (product) {
      await destroySingle(product.thumbnail.public_id);
      await destroyMultiple(product.images.map((image) => image.public_id));

      for (const imageId of product.images) {
        await Gallery.findByIdAndDelete(imageId._id);
      }

      await Product.findOneAndDelete({ slug });
      responseHandler.ok(res, {});
    } else {
      responseHandler.badrequest(res, { msg: "Can't find product" });
    }
  } catch {
    responseHandler.error(res);
  }
};

export const search = async (req, res) => {
  try {
    const { q: value, limit, skip } = req.query;
    if (value.trim()) {
      const products = await Product.find({
        title: { $regex: new RegExp(value), $options: "i" },
      })
        .skip(skip)
        .limit(limit)
        .select("title slug thumbnail");
      responseHandler.ok(res, { products, total: products.length });
    } else {
      responseHandler.ok(res, { products: [], total: 0 });
    }
  } catch {
    responseHandler.error(res);
  }
};

export const related = async (req, res) => {
  try {
    let products = await Product.find({ category: req.query.category }).limit(
      10
    );
    products = products.filter((product) => product.slug !== req.query.slug);

    responseHandler.ok(res, { products });
  } catch {
    responseHandler.error(res);
  }
};

export const popular = async (req, res) => {
  try {
    const orderDetailCount = await OrderDetail.aggregate([
      {
        $group: {
          _id: "$product",
          count: { $sum: 1 },
          total: { $sum: "$qty" },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          product: "$_id",
          count: 1,
          total: 1,
        },
      },
    ]).exec();

    let products = [];
    for (let item of orderDetailCount) {
      const product = await Product.findById(item.product).select(
        "title subTitle thumbnail price slug"
      );
      products = [...products, { ...item, product }];
    }

    responseHandler.ok(res, { products, total: products.length });
  } catch {
    responseHandler.error(res);
  }
};
