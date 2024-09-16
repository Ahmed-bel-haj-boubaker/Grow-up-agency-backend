# Use the official Node.js image with the desired version
FROM node:18.17.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start:prod"]
