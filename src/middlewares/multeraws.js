// import multer from "multer"
// import multerS3 from 'multer-s3'
// import AWS from 'aws-sdk';
// import dotenv from "dotenv";
// dotenv.config();
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//   });
  
//   // Upload Middleware
// export const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: process.env.S3_BUCKET_NAME,
//       metadata: (req, file, cb) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: (req, file, cb) => {
//         const uniqueKey = `uploads/${Date.now()}_${file.originalname}`;
//         cb(null, uniqueKey);
//       },
//     }),
//   });

import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer to store files in memory
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).single('file'); // Adjust field name to match the form or request



// Function to upload a file to S3
export const uploadFileToS3 = async (file) => {

  const uniqueKey = `uploads/${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: uniqueKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));
  return uniqueKey; // Return the unique key for saving in the database
};

// Function to retrieve a file from S3
export const getFileFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const response = await s3.send(command);
  return response.Body; // Returns a stream
};

// Function to delete a file from S3
export const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  await s3.send(new DeleteObjectCommand(params));
  return `File with key ${key} deleted`;
};
