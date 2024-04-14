with resource := assert_single((
  select Resource {
    value
  }
  filter .key = <str>$key
    and .owner = global currentUser
))
select resource.value ?? 0
