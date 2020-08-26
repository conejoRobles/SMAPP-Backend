FROM node:carbon-alpine
RUN mkdir /smapp-backend
COPY app.js /smapp-backend
COPY package.json /smapp-backend
COPY package-lock.json /smapp-backend
WORKDIR /smapp-backend
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
EXPOSE 3200
CMD node app.js
