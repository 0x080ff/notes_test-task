FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN NODE_ENV=production npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app /app

CMD ["node", "dist/main"]