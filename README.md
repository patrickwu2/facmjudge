# FACM Judge
NTU CSIE Council Freshmen ACM Cup Judge

# Original Project
https://github.com/bobogei81123/adajudge  

https://github.com/tzupengwang/adajudge

https://github.com/qazwsxedcrfvtg14/dsajudge

# Installation

- Environment : Centos 7

```
# install nvm
# https://github.com/creationix/nvm

# install node
nvm install v10.10.0

# install mongodb
sudo yum install mongodb-org
systemctl restart mongod
systemctl enable mongod

# install gulp and forever
npm install -g gulp forever

# Install package, it would take a while
npm install

# Init
gulp init
# 1. Auto install semantic
# 2. Move semantic to dist

# Change src/server/config.js
# 1. example: config.example.js
# 2. change secret, port, maxWorkers .......


# Build
gulp build

# Install seccomp
sudo yum install seccomp-devel

# Build and copy isolate
mv /usr/bin/ld /usr/bin/_ld
ln -s /usr/bin/ld.bfd /usr/bin/ld # centos7 strange soft link ......
yum install gcc gcc-c++ libcap-devel asciidoc -y
sudo -H gulp isolate # make sure to execute it 4 times

# Unzip fonts.tar.gz in dist/static
tar xvf fonts.tar.gz -C dist/static/

# Link MathJax
ln -s ../../node_modules/mathjax/ dist/static/MathJax

# Edit isolate config
sudo cp isolate.conf /usr/local/etc/isolate

# Run server
## open firewall port
## change mode => isolate/isolate-check-environment 
./start.sh
forever restart 0

```

- Debug Tool

```
# Isolate
./isolate --cg --box-id 0 --meta /dev/shm/isolate/META/0 --process --full-env --run -- /usr/bin/env ls -al /usr/bin/ld

./isolate --cg --box-id 0 --meta /dev/shm/isolate/META/0 --process --full-env --run -- /usr/bin/env g++ -O2 -static user.c
```

# Issue
Kindly submit any issue you found on github.
