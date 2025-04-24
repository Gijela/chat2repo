# Stage 1: Build the application
FROM node:21-alpine AS builder

# Install build dependencies (Python for node-gyp) and pnpm
RUN apk add --no-cache python3 build-base && npm install -g pnpm

WORKDIR /app

# Copy dependency manifests
# Ensure pnpm-lock.yaml exists and is committed to your repository
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies needed for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
# Make sure you have a .dockerignore file to exclude unnecessary files (like node_modules, .git, .env)
COPY . .

# Build the Next.js application
RUN pnpm build

# Remove development dependencies after build
RUN pnpm prune --prod

# Stage 2: Production environment
FROM node:21-alpine

WORKDIR /app

# Install pnpm globally (needed for CMD ["pnpm", "start"])
# Alternatively, you could use CMD ["node", "server.js"] or CMD ["next", "start"] if preferred
RUN npm install -g pnpm

# Create a non-root user and group for security
RUN addgroup -S nextjsgroup && adduser -S nextjsuser -G nextjsgroup

# Copy necessary files from the builder stage with correct ownership
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/package.json ./package.json
# Copy production node_modules
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/node_modules ./node_modules
# Copy built assets
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/.next ./.next
# Copy public assets (if they exist and are needed at runtime)
COPY --from=builder --chown=nextjsuser:nextjsgroup /app/public ./public

# Switch to the non-root user
USER nextjsuser

# Expose the port the app runs on
EXPOSE 3000

# Set the command to start the application
# This assumes "start" script in package.json runs "next start"
CMD ["pnpm", "start"]
