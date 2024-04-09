with user := global currentUser
select User {
  id,
  key,
  isAdmin,
  isBanned,
}
filter user.isAdmin
  and (not .isAdmin or (.id = user.id))
order by .isAdmin then .isBanned
