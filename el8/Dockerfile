FROM ghcr.io/geonet/base-images/centos:stream8

# Copying all contents of rpmbuild repo inside container
COPY . .

# Install prerequisites
RUN dnf module enable -y nodejs:16 \
  && dnf install -y epel-release epel-next-release \
  'dnf-command(config-manager)' \
  && dnf config-manager --set-enabled powertools

# Update system
RUN dnf update -y

# Install dependencies
RUN dnf install -y boost automake boost-filesystem boost-iostreams \
  boost-program-options boost-regex boost-signals boost-system \
  boost-thread cairo cairo-devel dnf-plugins-core fontconfig \
  fontconfig-devel freetype freetype-devel gcc gcc-c++ git glibc \
  kernel-devel libdbi libdbi-devel libgfortran libxml2 \
  libxml2-devel make ncurses ncurses-devel nodejs npm octave \
  openssl pango pango-devel perl-devel python3 qt5-qtwebengine \
  rpm-build rpmdevtools rpm-sign rpmlint shadow-utils systemd

# Install python and npm modules
RUN pip3 install --user numpy python-dateutil twisted boto3 \
  && npm install \
  && npm run-script build

# All remaining logic goes inside main.js ,
# where we have access to both tools of this container and
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
