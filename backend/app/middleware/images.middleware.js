import cloudinary from "../config/cloudinary.config.js";

export const uploadSingle = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "nikeshoes/account",
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const uploadMultiple = async (files) => {
  try {
    const results = [];
    for (const file of files) {
      const result = await uploadSingle(file);
      results.push(result);
    }
    return results;
  } catch (err) {
    console.log(err);
  }
};

export const destroySingle = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const destroyMultiple = async (public_ids) => {
  try {
    for (const public_id of public_ids) {
      await destroySingle(public_id);
    }
  } catch (err) {
    console.log(err);
  }
};
