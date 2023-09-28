FROM ghcr.io/geonet/base-images/rpmbuild-centos-stream8

# Copying all contents of rpmbuild repo inside container
COPY . .

# Install python and npm modules
RUN pip3 install --user numpy python-dateutil twisted boto3 \
  && npm install \
  && npm run-script build

# All remaining logic goes inside main.js ,
# where we have access to both tools of this container and
# contents of git repo at /github/workspace
ENTRYPOINT ["node", "/lib/main.js"]
