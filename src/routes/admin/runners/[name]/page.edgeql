select Runner {
  key,
  id,
  isBanned,
  isActive,
  chips,
  tokens,
  penalties: {
    reason,
    isBanned,
    id
  },
  hasIdentity := exists .identity
}
filter .key = <str>$key