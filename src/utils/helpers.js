import jwt from "jsonwebtoken";

// Utility function to generate JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

// Utility function to handle errors
export const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
