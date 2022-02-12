FROM node:14.15.4

ENV TZ Asia/Seoul

# ARG port=8901

RUN mkdir -p /home/madeit-api

WORKDIR /home/madeit-api

ADD . /home/madeit-api
RUN npm i
RUN npm run build

EXPOSE 8901

ENTRYPOINT ["npm", "run", "start:prod"]
