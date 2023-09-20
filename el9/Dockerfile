FROM ghcr.io/geonet/base-images/centos:centos7

# Copying all contents of rpmbuild repo inside container
COPY . .

# Installing tools needed for rpmbuild ,
RUN curl -O https://nodejs.org/dist/v16.20.2/node-v16.20.2-linux-x64.tar.xz \
    && tar --strip-components 1 -xvf node-v* -C /usr/local
RUN yum install -y rpm-build rpmdevtools rpmlint rpm-sign make git autoconf automake createrepo gcc gcc-c++ tar yum-utils python python3

RUN npm install \
    && npm run-script build

# All remaining logic goes inside main.js ,
# where we have access to both tools of this container and
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
