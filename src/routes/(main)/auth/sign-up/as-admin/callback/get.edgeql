select (insert Admin {
  key := <str>$key,
})
if not exists (select User filter User.key = <str>$key)
else (
  insert Admin {
    key := <str>$key ++ <str>random()
  }
)