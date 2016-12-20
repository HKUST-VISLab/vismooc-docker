FROM ubuntu 
MAINTAINER Zhen LI <thu.lz@outlook.com>
# update apt-get
RUN \
apt-get update
# Install Redis RUN \
RUN apt-get -y -qq install python3 redis-server \
    mongodb python3-pip
ADD ./dep/node /opt/node
RUN cd /usr/local/bin && ln -s /opt/node/bin/* .
ADD ./src /src
ADD ./data /src/data
RUN cd /src/vismooc-data-server && \
    pip3 install -r requirements.txt && \
    ln -s /usr/bin/python3 /usr/bin/python
RUN apt-get -y -qq install supervisor
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# data-server dependencies install
RUN cd /src/vismooc-web-server && \
    npm install && \
    node /src/vismooc-web-server/node_modules/gulp/bin/gulp.js build
# web-server dependencies install
RUN mkdir -p /data/db
WORKDIR /src/vismooc-web-server
EXPOSE 9999
CMD ["/usr/bin/supervisord"]