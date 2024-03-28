with identity := (
  select ext::auth::Identity 
  filter .id = <uuid>$identity
)
select (insert User {
  key := <str>$key,
  identity := identity,
  isAdmin := true
})
if not exists (select User filter User.key = <str>$key)
else (
  insert User {
    key := <str>$key ++ <str>random(),
    identity := identity,
    isAdmin := true
  }
)
