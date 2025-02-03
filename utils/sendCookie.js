import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true, 
      maxAge: 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    .set("Authorization", `Bearer ${token}`)
    .json({
      success: true,
      message,
    });
};