select (insert Admin {
  name := <str>$name,
})
if not exists (select User filter User.name = <str>$name)
else (
  insert Admin {
    name := <str>$name ++ <str>random()
  }
)