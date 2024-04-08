select global currentUser {
  key,
  tokens,
  chips,
  isAdmin,
  mails := count(.<recipient[is Mail]),
}
