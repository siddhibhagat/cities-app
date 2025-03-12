# Step 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./  
RUN npm install

# Copy the Angular source code into the container
COPY . .  

# Build the Angular application (with correct production settings)
# RUN npm run build --configuration=production
RUN npm run build

# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Remove default Nginx files to avoid the "Welcome to nginx" page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from 'browser/' to Nginx's default directory
COPY --from=build /app/dist/city-frontend/browser /usr/share/nginx/html

# Expose port 80 (default HTTP port for Nginx)
EXPOSE 80  

# Start Nginx to serve the Angular application
CMD ["nginx", "-g", "daemon off;"]


