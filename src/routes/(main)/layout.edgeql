select global currentUser {
  key,
  tokens,
  chips,
  isAdmin,
  mails := count((
    select .<recipient[is Mail]
    filter not .isReceived
  )),
}
