#!/bin/bash
# shellcheck disable=SC2154
set -euo pipefail

flavour="$1" # "consumer", "work" or "blue"
target=("$2") # Either "installer" or a path to an EXE

if [ "$flavour" == "blue" ]; then
  name="Threema Blue Desktop"
  if [ "$2" == "installer" ]; then
    target=(app/build/dist-electron/installers/threema_blue*-setup.exe)
  fi
elif [ "$flavour" == "work" ]; then
  name="Threema Work Desktop"
  if [ "$2" == "installer" ]; then
    target=(app/build/dist-electron/installers/threema_work*-setup.exe)
  fi
elif [ "$flavour" == "consumer" ]; then
  name="Threema Desktop"
  if [ "$2" == "installer" ]; then
    target=(app/build/dist-electron/installers/threema_web*-setup.exe)
  fi
else
  echo "Invalid signing flavour: $flavour"
  exit 1
fi

echo "Signing file ${target[0]}..."
echo "$ms_authenticode_password" | signcode \
    -spc authenticode.spc -v authenticode.pvk -a sha256 -$ commercial \
    -n "$name" \
    -i https://www.threema.ch/ \
    -t http://timestamp.digicert.com/scripts/timstamp.dll \
    -tr 10 \
    "${target[0]}"