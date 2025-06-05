import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { nanoid } from "nanoid";
import {
  verifyEmailByType,
  changePassword,
  generateToken,
  jwtCookieOptions
} from "../utils/auth.utils.js";
import {sendEmailForGotPassword} from "../utils/mail.utils.js"



export const emailVerification = async (req, res) => {
  console.log(req.query);
  try {
    await verifyEmailByType(req.query);
    res.status(200).json({
      success: true,
      msg: "Verify Email Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Not Verify Your Email",
      error: error,
    });
  }
};

export const forogtPassword = async (req, res) => {

  const { email } = req.body;
  console.log(email)
  try {

    const askChangePassword =  await User.findOne({ userEmail: email });

    askChangePassword.forgotPasswordId = nanoid();
    askChangePassword.save();

    sendEmailForGotPassword(askChangePassword);
    res.status(200).json({
      success: true,
      msg: "Password reset email sent successfully",
    });

  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      success: false,
      msg: error.message || 'request failed',
    });

  }

};

export const resetPassword = async (req, res) => {
  try {
    const data = await changePassword(req.body, req.query);
    res.status(200).json({
      success: true,
      msg: "Password changed!",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error",
    });
  }
};

export const verifyToken = async (req, res) => {

  try {
    const { token } = req.cookies;

    if (!token) throw new Error("Token not Exist");

    const data = jwt.verify(
      token,
      String(process.env.JWT_SECRET)
    );

    if (!data) throw new Error("Token Not Valid");

    res.status(200).json({
      success: true,
      msg: "Auth success",
      data: data,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      msg: "Auth NOT success",
      error: error.msg || error,
    });
  }
};

export const refreshToken = async (req, res) => {
  const { userId } = req.body;
  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Generate a new token using the utility function
    const data = generateToken(user);
    const token = data.token;
    const payload = data.payload;

    // Set the token in cookies
    res.cookie("token", token, jwtCookieOptions);

    res.status(200).json({
      success: true,
      msg: "Token refreshed successfully",
      data: payload,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to refresh token",
      error: error.message || error,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      success: true,
      msg: "GoodBye!",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      msg: error.message || " Sign Out Failed",
      error:  error,
    });
  }
};
