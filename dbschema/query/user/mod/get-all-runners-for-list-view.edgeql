select Runner {
  name,
  memo,
  id,
  isBanned,
  isActive,
  chips,
  tokens,
  twitterId,
  hasIdentity := exists .identity,
  warnings,
  banneds,
}
