import Order from "../models/order.model.js";
import OrderDetail from "../models/orderDetail.model.js";
import Cart from "../models/cartItem.model.js";
import responseHandler from "../handler/response.handler.js";

export const getOne = async (req, res) => {
  try {
    await Order.findById(req.params.id).then(async (order) => {
      order._doc.details = await OrderDetail.find({ order: order._id })
        .sort({ product: 1, size: 1 })
        .populate("product", "title thumbnail price");
      responseHandler.ok(res, { order });
    });
  } catch {
    responseHandler.error(res);
  }
};

export const getByUser = async (req, res) => {
  try {
    await Order.find({ user: req.params.userId }).then(async (orders) => {
      for await (let order of orders) {
        const orderDetails = await OrderDetail.find({
          order: order._id,
        }).populate("product", "title thumbnail price");
        order.details = orderDetails;
      }
      responseHandler.ok(res, { orders, total: orders.length });
    });
  } catch {
    responseHandler.error(res);
  }
};

export const create = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user._id });
    const cart = await Cart.find({ user: req.user._id }).populate(
      "product",
      "title price"
    );
    const orderDetails = cart.map((item) => ({
      order: order._id,
      product: item.product,
      size: item.size,
      qty: item.qty,
      total: item.product.price * item.qty,
    }));
    for (const orderDetail of orderDetails) {
      await OrderDetail.create(orderDetail);
    }
    responseHandler.created(res, {
      msg: "Create order successfully",
    });
  } catch {
    responseHandler.error(res);
  }
};

export const getAll = async (req, res) => {
  try {
    const status = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]).exec();

    await Order.find(req.query).then(async (orders) => {
      for await (let order of orders) {
        const orderDetails = await OrderDetail.find({
          order: order._id,
        }).populate("product", "title thumbnail price");
        order.details = orderDetails;
      }

      responseHandler.ok(res, { orders, total: orders.length, status });
    });
  } catch {
    responseHandler.error(res);
  }
};

export const deleteAll = async (req, res) => {
  try {
    await Order.deleteMany({});
    await OrderDetail.deleteMany({});
    responseHandler.ok(res, { msg: "Delete all successfully" });
  } catch {
    responseHandler.error(res);
  }
};

export const search = async (req, res) => {
  try {
    const orders = await Order.find({
      phone: { $regex: new RegExp(req.query.phone), $options: "i" },
    });
    responseHandler.ok(res, { orders, total: orders.length });
  } catch {
    responseHandler.error(res);
  }
};

export const updateOne = async (req, res) => {
  try {
    await Order.updateOne({ _id: req.params.id }, req.body);
    responseHandler.ok(res, { msg: "Update successfully" });
  } catch {
    responseHandler.error(res);
  }
};

export const deleteOne = async (req, res) => {
  try {
    await Order.deleteOne({ _id: req.params.id });
    responseHandler.ok(res, { msg: "Delete successfully" });
  } catch {
    responseHandler.error(res);
  }
};
