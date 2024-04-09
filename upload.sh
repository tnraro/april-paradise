if [[ -z "${REMOTE_HOST}" ]]; then
  echo 'no env $REMOTE_HOST'
  exit 1
fi
if [[ -z "${REMOTE_CWD}" ]]; then
  echo 'no env $REMOTE_CWD'
  exit 1
fi

ssh "$REMOTE_HOST" \
  "cd $REMOTE_CWD && ./build.sh"