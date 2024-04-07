if [[ -z "${REMOTE_PATH}" ]]; then
  echo 'no env $REMOTE_PATH'
  exit 1
fi
if [[ -z "${REMOTE_HOST}" ]]; then
  echo 'no env $REMOTE_HOST'
  exit 1
fi
if [[ -z "${REMOTE_CWD}" ]]; then
  echo 'no env $REMOTE_CWD'
  exit 1
fi

rsync -vah build/april_paradise.tar $REMOTE_PATH

ssh "$REMOTE_HOST" \
  "cd $REMOTE_CWD && ./load.sh && docker compose restart app"