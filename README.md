# Vicmooc@v0.1.0 

(based on [vismooc-data-server@v0.2.0](https://github.com/HKUST-VISLab/vismooc-data-server/releases/tag/v0.2.0) and [vismooc-web-server@v0.2.0](https://github.com/HKUST-VISLab/vismooc-web-server/releases/tag/v0.2.0)).



## Requirement:

### OS
OS: Debian 8 (amd64)


### Software
- MongoDB@v3.2
- Redis@v3.2
- Python@v3.5
- NodeJs@v6.9.1


### Hardware
- CPU: Intel core i5-6500 @3.20GHz， 4 cores
- RAM: 8G
- Disk: Hard disk, >= 100Gb (actually, it depends on the size of dbsnapshot)


## Installation

### MongoDB
1. install MongoDB
2. start the service

### Redis
1. install Redis
2. start the service

### Data-server
1. install python@v3.5
2. cd ./data-server
3. pip install -r requirement.txt
4. add this command `"30 22 * * * python3 "${absPath}" ../config.json"` into crontab to run the script dailly.

### Web-server
1. install nodejs@v6.9.1
2. cd ./web-server
3. npm install && npm install -g pm2
4. pm2 start index.js

