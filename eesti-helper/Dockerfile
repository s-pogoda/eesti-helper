FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --silent && npm ci --only=production
COPY . . 
EXPOSE 3000
CMD ["npm", "start"]
