#!/bin/bash -e
if [ $GITHUB_ACTOR = "GeoNet" ] ; then
printf "you are inside %s and authorised" $GITHUB_ACTOR
exit 0
else
printf "you are not authorised to run as %s" $GITHUB_ACTOR
exit 1
fi
