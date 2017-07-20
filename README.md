# Vicmooc@v0.4.8

(based on [vismooc-data-server@v0.5.7](https://github.com/HKUST-VISLab/vismooc-data-server/releases/tag/v0.5.7) and 
[vismooc-web-server@v0.6.0](https://github.com/HKUST-VISLab/vismooc-web-server/releases/tag/v0.6.0)).

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
1. Setting the `bind-address` of MySql to `172.17.0.1`.
2. Setting the configuration under the folder `config`, then save the configuration as `config.json`.
3. Build the images and run the container `sudo docker-compose up -d`
