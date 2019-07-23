FROM node:10 AS api-builder

# Create app directory
WORKDIR /tmp/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./api/package*.json ./

# Install node_modules
RUN npm ci

# Bundle app source
COPY ./api .

# Compile 
RUN [ "npm", "run", "tsc" ]

##########################################################################################

FROM node:10 AS frontend-builder

# Create app directory
WORKDIR /tmp/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./frontend/package*.json ./

# Install node_modules
RUN npm ci

# Bundle app source
COPY ./frontend .

# Build project
ENV NODE_ENV production

# Compile 
RUN [ "npm", "run", "build" ]

##########################################################################################

FROM node:10

WORKDIR /usr/src/app/

# Copy homepage from frontend-builder
COPY --from=frontend-builder /tmp/dist ./frontend/

# Copy api stuff from api-builder
COPY --from=api-builder /tmp/build ./build/
COPY --from=api-builder /tmp/package*.json ./

# Install depencies
RUN npm ci --only=production

RUN mkdir data
RUN mkdir config

EXPOSE 80
VOLUME ["/usr/src/app/config"]
VOLUME ["/usr/src/app/data"]

ENTRYPOINT [ "npm", "run", "prod" ]