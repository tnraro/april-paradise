select User {
  key,
  id,
  chips,
  tokens,
  hasIdentity := exists .identity,
  mails := .<recipient[is Mail] {
    id,
    sender,
    title,
    isReceived,
    createdAt,
  }
}
filter .key = <str>$key and not .isAdmin
