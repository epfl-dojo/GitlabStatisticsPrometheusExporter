# Use the official Node.js image as parent image
FROM node:current-slim

# Set the working directory. If it doesn't exists, it'll be created
WORKDIR /app

# Define the env variable `PORT`
ENV PORT 3000

# Expose the port 3000
EXPOSE ${PORT}

# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./package.json /app/package.json

# Install the dependencies
RUN npm install

# Copy all files from current folder
# inside our image in the folder `/app`
COPY index.js /app

# Start the app
ENTRYPOINT ["node", "index.js"]