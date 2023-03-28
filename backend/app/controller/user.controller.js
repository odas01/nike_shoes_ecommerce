import User from "../models/user.model.js";
import responseHandler from "../handler/response.handler.js";
import {
  uploadSingle,
  destroySingle,
} from "../middleware/images.middleware.js";

export const getAll = async (req, res) => {
  try {
    const users = await User.find({ admin: false, deleted: false }).select(
      "-password"
    );

    responseHandler.ok(res, { users, total: users.length });
  } catch {
    responseHandler.error(res);
  }
};

export const getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

export const updateOne = async (req, res) => {
  const values = req.body;
  try {
    const currentUser = await User.findById(req.params.id);
    if (values.avatar) {
      await destroySingle(currentUser.avatar.public_id);
      const avatarRes = await uploadSingle(values.avatar);
      values.avatar = {
        public_id: avatarRes.public_id,
        url: avatarRes.url,
      };
    }

    User.findByIdAndUpdate(req.params.id, values, {
      new: true,
      update: true,
    })
      .select("-password ")
      .then((user) => responseHandler.ok(res, { user }));
  } catch {
    responseHandler.error(res);
  }
};

export const deleteOne = async (req, res) => {
  try {
    User.findByIdAndUpdate(req.params.id, { deleted: true }).then(() =>
      responseHandler.ok(res)
    );
  } catch {
    responseHandler.error(res);
  }
};

export const search = async (req, res) => {
  const value = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { fullname: { $regex: new RegExp(value), $options: "i" } },
        { email: { $regex: new RegExp(value), $options: "i" } },
      ],
      admin: false,
      deleted: false,
    });
    responseHandler.ok(res, users);
  } catch {
    responseHandler.error(res);
  }
};
