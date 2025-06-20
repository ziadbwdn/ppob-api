# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory

# Install application dependencies
RUN npm install

# Copy the rest of your application source code
COPY . .

# Expose the port your Express app listens on
EXPOSE 3000

# Command to run your application
CMD ["node", "server.js"]