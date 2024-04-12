with resource := assert_single((
  select Resource {
    value
  }
  filter .key = <str>$key
))
select resource.value ?? 0
