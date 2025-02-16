import jwt from "jsonwebtoken";
import pool from "../config/db.js"; 
import {ApiError} from "./ApiError.js";


// const generateAccessToken = (userId, email, role) => {
//   return jwt.sign(
//     { id: userId, email, role },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" }
//   );
// };


// const generateRefreshToken = (userId) => {
//   return jwt.sign(
//     { id: userId },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
//   );
// };


const generateAccessToken = async (id, email, role) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

const generateRefreshToken = async (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const generateAccessAndRefreshTokens = async (userId, email, role) => {
  try {
    // Await the token generation
    const accessToken = await generateAccessToken(userId, email, role);
    const refreshToken = await generateRefreshToken(userId);

    console.log("Generated Tokens:", accessToken, refreshToken);

    const exp_refresh = new Date();
    exp_refresh.setDate(exp_refresh.getDate() + 7); // Set expiration to 7 days

    // Store refresh token in the database
    await pool.query(
      `UPDATE users SET refresh_token = $1, refresh_token_expires_at = $2 WHERE id = $3`,
      [refreshToken, exp_refresh, userId]
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Error generating access and refresh tokens.");
  }
};