select User {
  id,
  key,
  isAdmin,
  isBanned,
}
order by .isAdmin then .isBanned
