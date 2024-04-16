select (
  select Achievement
  filter .user.id = <uuid>$user
).key
