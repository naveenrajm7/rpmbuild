FROM ghcr.io/geonet/base-images/centos:stream8

# Copying all contents of rpmbuild repo inside container
COPY . .

# Installing tools needed for rpmbuild ,
RUN dnf module enable -y nodejs:16

# install base and app requirements
RUN dnf install -y boost automake boost-filesystem boost-iostreams boost-program-options boost-regex boost-signals boost-system boost-thread cairo cairo-devel dnf-plugins-core epel-release epel-next-release fontconfig fontconfig-devel freetype freetype-devel gcc gcc-c++ git glibc kernel-devel libgfortran libxml2 libxml2-devel make ncurses ncurses-devel nodejs npm openssl pango pango-devel perl-devel python3 rpm-build rpmdevtools rpm-sign rpmlint shadow-utils subscription-manager systemd

# enable powertools
RUN yum config-manager --set-enabled powertools

# trigger an update after enabling epel-release and powertools
RUN dnf update -y

# install after epel is available
RUN dnf install -y libdbi libdbi-devel octave qt5-qtwebengine

# python modules
RUN pip3 install --user numpy python-dateutil twisted boto3

# python module having issue
# pip3 install --user m2crypto

# in-house
# seiscomp seiscomp-toast seiscomp3-aio

RUN npm install \
    && npm run-script build

# All remaining logic goes inside main.js ,
# where we have access to both tools of this container and
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
