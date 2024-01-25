FROM node:16-alpine as production-stage

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY public ./public
COPY dist .

ENV ACCESS_TOKEN_SECRET=e13048fb3eea6566...
ENV REFRESH_TOKEN_SECRET=32bb06efbfe7c626...
ENV JWT_TOKEN_EXPIRATION=1h
ENV MONGO_URI=mongodb+srv://user:6r05oqyPbkLNBUnX@cluster0.ru6kdim.mongodb.net/

EXPOSE 80

CMD ["node", "src/app.js"]
