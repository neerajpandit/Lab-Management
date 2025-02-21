import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  // connectionString: process.env.DB_URL,
  user: process.env.DB_USER ||'postgres',
  host: process.env.DB_HOST|| 'database',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Neeraj@1234' ,
  port: process.env.DB_PORT ||'5432',
  ssl: { rejectUnauthorized: false },
});



pool.on("connect", () => {
  console.log(`Connected to DB at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log("Connection pool established with the database");
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);  // Exit process with failure
});

export default pool;
