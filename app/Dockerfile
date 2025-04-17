FROM node:21-alpine AS build

WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:21-alpine AS run

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/static ./static
COPY --from=build /app/server.js server.js
CMD [ "node", "server.js" ]

EXPOSE 3000


