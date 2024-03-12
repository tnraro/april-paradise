select Runner {
  name,
  memo,
  id,
  isBanned,
  isActive,
  chips,
  tokens,
  twitterId,
  penalties: {
    reason,
    isBanned,
    id
  },
  hasIdentity := exists .identity
}
filter .name = <str>$name