FROM node:16.1.0-alpine

RUN apk update

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app
COPY . /app

RUN npm install

CMD ["npm", "start"]
