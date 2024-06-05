FROM node:21-alpine AS build

WORKDIR /docs
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:21-alpine AS run

WORKDIR /docs
COPY --from=build /docs/package.json ./package.json
COPY --from=build /docs/.vitepress/dist ./.vitepress/dist
COPY --from=build /docs/node_modules ./node_modules
CMD ["npm", "run", "preview"]

EXPOSE 4173


