FROM node:18
WORKDIR /usr/src/app

RUN npm install -g serve
COPY build ./build

EXPOSE 3000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod u+x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"] 
