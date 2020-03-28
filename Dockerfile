# Using CentOS 7 with Node 12 as base image to support rpmbuild
FROM centos/nodejs-12-centos7

# Copying all contents of rpmbuild repo inside container
COPY . .

# Installing tools needed for rpmbuild
RUN sudo yum install -y gcc rpm-build rpm-devel rpmlint make bash coreutils rpmdevtools

# LOG: check contents
RUN pwd && ls -la

# Creting rpmbuild directory tree 
RUN rpmdev-setuptree

# Setting up node to run our JS file
RUN npm install --production

# All remaining logic goes inside main.js , 
# where we have access to both tools of this container and 
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
