# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run tests before starting the app
RUN npm run test

# Expose the port the app runs on
EXPOSE 4000

# Run the app in development mode
CMD ["npm", "run", "start:dev"]
