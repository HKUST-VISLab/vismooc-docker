# install mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# install redis
sudo apt-get update
sudo apt-get install build-essential -y
wget http://download.redis.io/releases/redis-stable.tar.gz
tar xzf redis-stable.tar.gz
cd redis-stable
make
sudo apt-get install tcl8.5 -y
sudo make test
sudo make install
cd utils
sudo ./install_server.sh
sudo rm -rf redis-stable

# install python
sudo apt-get install build-essential libncursesw5-dev libreadline5-dev libssl-dev libgdbm-dev libc6-dev libsqlite3-dev tk-dev
sudo add-apt-repository ppa:fkrull/deadsnakes
sudo apt-get update
sudo apt-get install python3.5

# install nodejs
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential


# install the dependences of data-server
cd ./data-server
pip install -r requirement.txt
## run the script everynight
crontab -l > mycron
absPath=`realpath main.py`
echo "30 22 * * * python3 "${absPath}" ../config.json" >> mycron
crontab mycron
rm mycron
cd ..

# install the dependences of web-server
cd ./web-server
npm install --production && npm install -g pm2
sudo pm2 start index.js ../config.json 
