FROM node:6.9.1
ADD ./dist /dist
WORKDIR /dist
RUN npm install
EXPOSE 9999
CMD ["node","index.js"]
