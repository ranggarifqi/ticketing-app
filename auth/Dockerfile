FROM node:alpine
RUN apk add --no-cache make gcc g++ python3

WORKDIR /app
COPY package.json .
RUN npm install
RUN ["npm", "rebuild", "bcrypt", "-build-from-source"]
RUN apk del make gcc g++ python3

COPY . .

CMD ["npm", "start"]