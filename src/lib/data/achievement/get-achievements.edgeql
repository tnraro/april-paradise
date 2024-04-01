select (
  select Achievement
  filter .user = global currentUser
).key
