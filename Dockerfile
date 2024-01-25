FROM node:alpine as base

WORKDIR /V1flix-BE-GQL

COPY package.json yarn.lock ./

RUN rm -rf node_modules && yarn install --frozen-lockfile && yarn cache clean

COPY . .

CMD ["node --esm", "./server.ts"]