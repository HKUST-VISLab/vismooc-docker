FROM node:6.9.1
ADD ./dist /dist
WORKDIR /dist
RUN npm install -g pm2
RUN npm install
EXPOSE 9999
CMD ["pm2-docker","start", "index.js", "--", "../../config/config.json"]