FROM node:carbon-alpine
RUN mkdir /SMAPP-Backend
COPY app.js /SMAPP-Backend
COPY package.json /SMAPP-Backend
WORKDIR /SMAPP-Backend
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
EXPOSE 3000
CMD node app.js
