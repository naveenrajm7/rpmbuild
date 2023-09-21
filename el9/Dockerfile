FROM ghcr.io/geonet/base-images/centos:stream9

# Copying all contents of rpmbuild repo inside container
COPY . .

# Installing tools needed for rpmbuild ,
RUN dnf install -y rpm-build rpmdevtools rpm-sign rpmlint git dnf-plugins-core nodejs npm make automake gcc gcc-c++ kernel-devel python3 glibc

RUN npm install \
    && npm run-script build

# All remaining logic goes inside main.js ,
# where we have access to both tools of this container and
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
