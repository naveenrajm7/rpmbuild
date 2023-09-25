FROM ghcr.io/geonet/base-images/centos:centos7

# Copying all contents of rpmbuild repo inside container
COPY . .

# Install prerequisites
RUN curl -O https://nodejs.org/dist/v16.20.2/node-v16.20.2-linux-x64.tar.xz \
    && tar --strip-components 1 -xvf node-v* -C /usr/local \
    && yum install -y epel-release

# Update system
RUN yum update -y

# Install dependencies
RUN yum install -y autoconf automake boost boost-filesystem boost-iostreams \
  boost-program-options boost-regex boost-signals boost-system boost-thread \
  cairo cairo-devel createrepo fontconfig fontconfig-devel \
  freetype freetype-devel gcc gcc-c++ git libdbi libdbi-devel libgfortran \
  libxml2 libxml2-devel m2crypto make ncurses ncurses-devel numpy octave \
  openssl pango pango-devel perl-devel python3 qtwebkit rpm-build \
  rpmdevtools rpmlint rpm-sign shadow-utils systemd tar yum-utils

# Install python and npm modules
RUN pip3 install --user python-dateutil twisted boto3 \
  && npm install \
  && npm run-script build

# All remaining logic goes inside main.js ,
# where we have access to both tools of this container and
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
