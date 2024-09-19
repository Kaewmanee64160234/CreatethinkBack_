# Stage 1: Build the NestJS application
FROM node:16-alpine AS build-stage

# Install dependencies for building native modules (like nodemailer)
RUN apk add --no-cache \
    build-base \
    python3

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the NestJS application
FROM node:16-alpine AS production-stage

# Set working directory in the container
WORKDIR /app

# Copy only the built application from the previous stage
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package*.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Run the NestJS application
CMD ["node", "dist/main"]
