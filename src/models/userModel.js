import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsersService = async () => {
  const result = await pool.query("SELECT id,name,email,role FROM users");
  return result.rows;
};

export const getUserByIdService = async (id) => {
  const result = await pool.query(
    "SELECT id,name,email,role FROM users where id = $1",
    [id]
  );

  return result.rows[0];
};

export const createUserService = async (fullName, email, phone, password, role) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const result = await pool.query(
    "INSERT INTO users (fullName, email, phone, password,role) VALUES ($1, $2,$3,$4,$5) RETURNING *",
    [fullName, email,phone, hashedPassword, role]
  );
  return result.rows[0];
};

export const loginUserService = async (email, password) => {
  const userResult = await pool.query(
    "SELECT id, fullName, email, role, password FROM users WHERE email = $1",
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userResult.rows[0];

  // Compare hashed passwords
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }
  return user;
};

export const logoutUserService = async (id) => {
  try {
    const result = await pool.query(
      "UPDATE users SET refresh_token=$1 WHERE id=$2 RETURNING *",
      [null, id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error in LogoutUserService:", error.message);
    throw new Error("Database Error while logging out user");
  }
};

export const updateUserService = async (id, fullName, email,phone,status) => {
  const result = await pool.query(
    "UPDATE users SET fullName=COALESCE($1,fullName), email=COALESCE($2,email),phone=COALESCE($3,phone),status=COALESCE($4,status) WHERE id=$5 RETURNING *",
    [fullName, email, phone, status, id]
  );
  return result.rows[0];
};

export const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
