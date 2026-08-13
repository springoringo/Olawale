FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git python3

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache vips-dev

ENV NODE_ENV=production
COPY --from=build /app ./

RUN chown -R node:node /app
USER node

EXPOSE 1337
CMD ["npm", "run", "start"]
