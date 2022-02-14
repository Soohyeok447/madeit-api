FROM node:14.15.4

ENV TZ Asia/Seoul

RUN mkdir -p /home/madeit-api

WORKDIR /home/madeit-api

ADD . /home/madeit-api
RUN npm i

EXPOSE 8901

ENTRYPOINT ["npm", "run", "start:buildDev"]
