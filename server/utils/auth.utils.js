import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';


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

export const generateToken = (user) => {
  const payload = { ...user._doc, userPassword: undefined };
  const token = jwt.sign({ payload }, String(process.env.JWT_SECRET), {
      expiresIn: 60 * 60 * 1
  });
  return { token: token, payload: payload }

};

export const jwtCookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 1
};
