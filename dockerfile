FROM node:latest
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node" , "src/index.js"]

# Use the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]