FROM node:7.7-wheezy
MAINTAINER osu361group5

RUN apt-get -y update && apt-get install -y python make build-essential

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

EXPOSE 3000
CMD ["npm" "start"]




