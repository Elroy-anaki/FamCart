import User from "../models/user.model.js";

export const changePassword = async (data, queryParams) => {
  try {
    const { password } = data;

    const user = await User.findOne({ _id: queryParams.userId });
    user.userPassword = password;
    user.forgotPasswordId = undefined;
    user.save();
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyEmailByType = async (data) => {
  try {
    const user = await User.findByIdAndUpdate(data.userId, { verify: true });
  } catch (error) {
    console.log("Function", error);
    throw error;
  }
};
