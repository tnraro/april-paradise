if [[ -z "${REMOTE_PATH}" ]]; then
  echo 'no env $REMOTE_PATH'
  exit 1
fi

rsync -vah build/april_paradise.tar $REMOTE_PATH