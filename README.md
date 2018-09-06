# Vicmooc@v0.4.42

(based on [vismooc-data-server@v0.9.6](https://github.com/HKUST-VISLab/vismooc-data-server-haha/releases/tag/v0.9.7), 
[vismooc-web-server@v0.13.6](https://github.com/HKUST-VISLab/vismooc-web-server-haha/releases/tag/v0.13.6) and
[vismooc-front-end@v0.7.1](https://github.com/HKUST-VISLab/vismooc-front-end-haha/releases/tag/v0.7.1)).

## Requirement:

### OS
OS: Debian 8 (amd64)

### Software
- Docker

### Hardware
- CPU: Intel core i5-6500 @3.20GHz， 4 cores
- RAM: 8G
- Disk: Hard disk, >= 100Gb (actually, it depends on the size of dbsnapshot)

## Installation

### Docker
1. install Docker and Docker-compose

### vismooc
1. Setting the configuration under the folder `config`, then save the configuration as `config.json`.
2. Build the images and run the container `sudo docker-compose up -d`
