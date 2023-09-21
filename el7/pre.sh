#!/bin/bash -e
if ! echo "$GITHUB_REPOSITORY" | grep -qE '^GeoNet/'; then
  printf "you are not authorised to run under %s" $GITHUB_REPOSITORY
  exit 1
fi
exit 0

