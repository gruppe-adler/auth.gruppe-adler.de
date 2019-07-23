FROM node:10-alpine AS api-builder

# Create app directory
WORKDIR /tmp/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install node_modules
RUN npm ci

# Bundle app source
COPY . .

# Compile 
RUN [ "npm", "run", "tsc" ]

##########################################################################################

FROM node:10-alpine AS frontend-builder

# Create app directory
WORKDIR /tmp/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install node_modules
RUN npm ci

# Bundle app source
COPY . .

# Build project
ENV NODE_ENV production
RUN npm run build

# Compile 
RUN [ "npm", "run", "tsc" ]

##########################################################################################

FROM node:10-alpine
WORKDIR /usr/src/app/

# Copy homepage from frontend-builder
COPY --from=frontend-builder /tmp/dist ./frontend/

# Copy api stuff from api-builder
COPY --from=api-builder /tmp/build ./build/
COPY --from=api-builder /tmp/package*.json ./
COPY --from=api-builder /tmp/config ./

# Install depencies
RUN npm ci --only=production

EXPOSE 80
VOLUME ["/usr/src/app/config"]
VOLUME ["/usr/src/app/data"]

ENTRYPOINT [ "npm", "run", "prod" ]