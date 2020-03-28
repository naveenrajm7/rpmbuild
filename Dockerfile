# Using CentOS 7 with Node 12 as base image to support rpmbuild
FROM centos:7

# Copying all contents of rpmbuild repo inside container
COPY . .

# Installing tools needed for rpmbuild
RUN yum install -y gcc rpm-build rpm-devel rpmlint make rpmdevtools

# LOG: check contents
RUN pwd && ls -la 

# Creting rpmbuild directory tree 
RUN rpmdev-setuptree

# Setting up node to run our JS file
# Download Node Linux binary
RUN cd ~ && curl -O https://nodejs.org/dist/v12.16.1/node-v12.16.1-linux-x64.tar.xz

# Extract and install
RUN tar --strip-components 1 -xzvf node-v* -C /usr/local

# Verify node version
RUN node --version

# Install all dependecies to execute main.js
RUN npm install --production

# All remaining logic goes inside main.js , 
# where we have access to both tools of this container and 
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
