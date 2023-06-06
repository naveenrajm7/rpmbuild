FROM quay.io/centos/centos:stream8

# Copying all contents of rpmbuild repo inside container
COPY . .

# Installing tools needed for rpmbuild ,
# depends on BuildRequires field in specfile, (TODO: take as input & install)
RUN dnf install -y rpm-build rpmdevtools rpm-sign rpmlint git dnf-plugins-core
RUN chmod +x /entrypoint.sh

# All remaining logic goes inside main.js ,
# where we have access to both tools of this container and
# contents of git repo at /github/workspace
ENTRYPOINT ["/entrypoint.sh"]
