#!/bin/bash
# shellcheck disable=SC2154
set -euo pipefail

if [ -z ${THREEMA_WEB_VERSION+x} ]
  then echo "THREEMA_WEB_VERSION is not set. Cannot patch!";
  exit 1;
fi

cd "app/dependencies/threema-web/release/$THREEMA_WEB_VERSION/"

echo "Enable in-memory sessions."
sed -i.bak -E "s/IN_MEMORY_SESSION_PASSWORD:(true|false|0|1|\!0|\!1)/IN_MEMORY_SESSION_PASSWORD:true/g" -- *.bundle.js

cd ../../../../..
