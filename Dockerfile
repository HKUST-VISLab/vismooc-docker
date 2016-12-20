FROM node:6.9.1
ADD ./vismooc-web-server /src
WORKDIR /src
RUN npm install && npm build
EXPOSE 9999
CMD ["npm", "start"]
