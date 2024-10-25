FROM node:16-alpine AS builder
# WORKDIR here says that we want to add the source code of our application to the image.
# This line of instruction creates a directory called app in our image, and adds our source code to that directory.
WORKDIR /app

COPY . ./
COPY package.json ./
COPY package-lock.json ./
RUN npm install production
RUN npm install -g serve
RUN npm run build

FROM node:16-alpine
WORKDIR /app

COPY --from=builder /app/build ./build
RUN npm install -g serve

EXPOSE 3002
CMD ["serve", "-s", "build", "-p", "3002"]
