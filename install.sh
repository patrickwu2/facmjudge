# install nvm
echo "Install nvm"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
# install node
echo "Install node v10.10.0"
source ~/.bashrc
nvm install v10.10.0

# install mongodb
echo "Install mongodb"
cp centos7-mongodb /etc/yum.repos.d/mongodb-org-4.0.repo
yum install -y mongodb-org
systemctl enable mongod
systemctl restart mongod

# install gulp forever
npm install -g gulp forever

# install packages
npm install 

# init gulp
gulp init

# install isolate
echo "install isolate"
yum instsall seccomp-devel
mv /usr/bin/id /usr/bin/_ld
ln -s /usr/bin/ld.bfd /usr/bin/ld
yum install gcc gcc-c++ libcap-devel asciidoc -y
gulp isolate
gulp isolate
gulp isolate
gulp isolate
cp isolate.conf /usr/local/etc/isolate
chmod 700 isolate/isolate-check-environment

# mathjax and fonts
echo "mathjax and fonts"
tar xvf fonts.tar.gz -C dist/static/
ln -s node_modules/mathjax/ dist/static/MathJax

# run server
firewall-cmd --zone=public --add-port=3333/tcp --permanent
firewall-cmd --reload
bash start.sh




