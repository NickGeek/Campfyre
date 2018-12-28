FROM node:10.14.2

LABEL maintainer Nick Webster <nick@nick.geek.nz>

WORKDIR /www/campfyre-api

ADD package.json /www/campfyre-api
ADD package-lock.json /www/campfyre-api
RUN npm ci

ADD index.js /www/campfyre-api

CMD ["node", "index.js"]

EXPOSE 3973
