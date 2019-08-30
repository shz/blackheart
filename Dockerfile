FROM node:8-alpine
EXPOSE 8000

WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
CMD [ "node", "main.js" ]
