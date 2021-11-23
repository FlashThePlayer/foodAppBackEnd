FROM node:17

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install --only=prod

EXPOSE 3000

COPY . .

ENTRYPOINT ["/usr/local/bin/npm", "run", "start"]
