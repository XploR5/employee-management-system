# Use an existing Node.js image as base
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy all the files from the current directory to the working directory
COPY . .

# Specify the command to run when the container starts
CMD [ "npm", "start" ]
