FROM python:3.5
ADD ./vismooc-data-server /src
RUN cd / && mkdir vismood-test-data
WORKDIR /src
RUN pip install -r requirements.txt
