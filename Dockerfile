# Use an official Node.js runtime as the base image.
# Using 'alpine' makes the image smaller, which is good for faster deploys.
# '20' is the Node.js major version. Adjust if you use a different version (e.g., node:18-alpine).
FROM node:20-alpine
# All subsequent commands will run from /app.
WORKDIR /app
# npm install won't need to re-run, making builds faster.
COPY package.json ./
COPY package-lock.json ./
# ensuring consistent builds.
RUN npm ci
COPY . .
EXPOSE 3000

CMD ["node", "server.js"]
