FROM centos:7

COPY . .

RUN yum install -y gcc rpm-build rpm-devel rpmlint make bash coreutils rpmdevtools

RUN rpmdev-setuptree

COPY cello.spec ~/rpmbuild/SPECS/

RUN rpmbuild -ba ~/rpmbuild/SPECS/cello.spec

RUN tree ~/rpmbuild

