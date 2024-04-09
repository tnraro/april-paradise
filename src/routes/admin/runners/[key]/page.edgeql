select User {
  key,
  id,
  chips,
  tokens,
  isAdmin,
  isBanned,
  hasIdentity := exists .identity,
  mails := .<recipient[is Mail] {
    id,
    sender,
    title,
    isReceived,
    createdAt,
  },
  inventory: {
    key,
    category,
    createdAt,
  }
}
filter .key = <str>$key
