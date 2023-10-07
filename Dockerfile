FROM node:alpine as builder

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN apk add --update python3 make g++\ && rm -rf /var/cache/apk/*

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]