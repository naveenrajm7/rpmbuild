# Using CentOS 7 with Node 12 as base image to support rpmbuild
FROM centos:7

# Copying all contents of rpmbuild repo inside container
COPY . .

# Installing tools needed for rpmbuild
RUN yum install -y gcc rpm-build rpm-devel rpmlint make bash coreutils rpmdevtools

# LOG: check contents
RUN pwd && ls -la

# Creting rpmbuild directory tree 
RUN rpmdev-setuptree

# Setting up node to run our JS file
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.13.1/install.sh | bash
RUN nvm install v12.16.1

RUN npm install --production

# All remaining logic goes inside main.js , 
# where we have access to both tools of this container and 
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
