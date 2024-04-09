with user := global currentUser
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
filter user.isAdmin
  and .key = <str>$key
  and (not .isAdmin or (.id = user.id))
