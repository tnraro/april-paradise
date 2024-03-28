with identity := (
  select ext::auth::Identity 
  filter .id = <uuid>$identity
)
select (insert Admin {
  key := <str>$key,
  identity := identity
})
if not exists (select User filter User.key = <str>$key)
else (
  insert Admin {
    key := <str>$key ++ <str>random(),
    identity := identity
  }
)