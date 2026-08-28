FROM node:22-alpine

RUN npm install -g pm2

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["pm2-runtime", "ecosystem.config.js"]
