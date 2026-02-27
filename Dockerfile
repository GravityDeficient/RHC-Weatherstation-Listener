FROM node:16-alpine

RUN npm install -g pm2

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

CMD ["pm2-runtime", "ecosystem.config.js"]
