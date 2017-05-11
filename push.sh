#!/bin/bash

if [ -z ${S3CMD_CONFIG_FILE+x} ]; then
	echo '$S3CMD_CONFIG_FILE was not set'
	exit 1
fi

echo "Now syncing everything to S3"
s3cmd -c ${S3CMD_CONFIG_FILE} sync build/ s3://ou-fa-rogierslag.nl -r -P
echo "And done!"
