import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

// const pool = new Pool({
//   // connectionString: process.env.DB_URL,
//   user: process.env.DB_USER ||'postgres',
//   host: process.env.DB_HOST|| 'database',
//   database: process.env.DB_NAME || 'postgres',
//   password: process.env.DB_PASSWORD || 'Neeraj@1234' ,
//   port: process.env.DB_PORT ||'5432',
//   ssl: { rejectUnauthorized: false },
// });

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: isProduction ? process.env.AWS_DB_USER : process.env.DB_USER || 'postgres',
  host: isProduction ? process.env.AWS_DB_HOST : process.env.DB_HOST || 'localhost',
  database: isProduction ? process.env.AWS_DB_NAME : process.env.DB_NAME || 'postgres',
  password: isProduction ? process.env.AWS_DB_PASSWORD : process.env.DB_PASSWORD || 'password',
  port: isProduction ? process.env.AWS_DB_PORT : process.env.DB_PORT || '5432',
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Enable SSL for production if needed
});

// const pool = new Pool({
//   // connectionString: process.env.DB_URL,
//   user: 'postgres',
//     host: 'postgres.cjkes8qo8we5.ap-south-1.rds.amazonaws.com',
//     database: 'postgres',
//     password: 'WorldMarketView1234',
//     port: 5432,
//     ssl: { rejectUnauthorized: false },
// });


pool.on("connect", () => {
  console.log(`Connected to DB at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log("Connection pool established with the database");
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);  // Exit process with failure
});

export default pool;
