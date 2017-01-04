FROM node:6.9.1
ADD ./dist /dist
WORKDIR /dist
RUN npm install && npm install -g pm2
EXPOSE 9999
CMD ["pm2","start", "index.js", "--", "../../config/config.json"]