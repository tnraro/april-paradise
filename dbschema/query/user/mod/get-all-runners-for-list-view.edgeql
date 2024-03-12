select Runner {
  name,
  memo,
  id,
  isBanned := .is_banned,
  isActive := .is_active,
  chips,
  tokens,
  twitterId := .twitter_id,
  hasIdentity := exists .identity,
  warnings,
  banneds,
}
