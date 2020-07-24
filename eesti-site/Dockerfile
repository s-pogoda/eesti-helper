FROM node:alpine as react-build
#TODO: re-check dependencies
RUN apk add git openssh-client

WORKDIR /app
COPY package.json ./
RUN  npm install MrRio/jsPDF && npm install --silent 

COPY ./ ./
RUN npm run build


FROM nginx:alpine
#COPY nginx-config.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
