import CartItem from "../models/cartItem.model.js";
import responseHandler from "../handler/response.handler.js";

export const getOne = async (req, res) => {
  const { _id: user } = req.user;
  try {
    const cartItems = await CartItem.find({ user })
      .populate("product", "title slug thumbnail price")
      .sort({ updatedAt: -1 });
    responseHandler.ok(res, { items: cartItems, total: cartItems.length });
  } catch {
    responseHandler.error(res);
  }
};

export const create = async (req, res) => {
  const { _id: user } = req.user;

  try {
    const { product, size, qty, stock } = req.body;

    const cartItem = await CartItem.findOne({
      user,
      product,
      size,
      stock,
    });

    if (!cartItem) await CartItem.create({ ...req.body, user });
    else
      await CartItem.updateOne(
        { user, product, size },
        { qty: cartItem.qty + qty }
      );

    responseHandler.ok(res, { msg: "Created" });
  } catch {
    responseHandler.error(res);
  }
};
export const deleteOne = async (req, res) => {
  const { _id: user } = req.user;
  console.log(user);

  try {
    await CartItem.deleteMany({ user });
    responseHandler.ok(res, { msg: "Deleted" });
  } catch {
    responseHandler.error(res);
  }
};

export const deleteOneOrAll = async (req, res) => {
  const { _id: user } = req.user;
  try {
    console.log(req.query?.cartItem);
    await CartItem.deleteMany({ user: req.params.id });
    if (!req.boody) {
      await CartItem.deleteMany({ user: req.params.id });
    }
    responseHandler.ok(res, { msg: "Deleted all" });
  } catch {
    responseHandler.error(res);
  }
};

export const updateItem = async (req, res) => {
  const itemId = req.params.itemId;
  try {
    const item = await CartItem.findByIdAndUpdate(itemId, req.body, {
      new: true,
      update: true,
    }).populate("product", "title slug thumbnail price");
    setTimeout(() => {
      responseHandler.ok(res, { item });
    }, 1000);
  } catch {
    responseHandler.error(res);
  }
};
export const deleteItem = async (req, res) => {
  const itemId = req.params.itemId;
  try {
    await CartItem.findByIdAndDelete(itemId);
    responseHandler.ok(res, { msg: "Delete successfully" });
  } catch {
    responseHandler.error(res);
  }
};
