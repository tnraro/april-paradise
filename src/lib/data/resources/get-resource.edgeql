with resource := assert_single((
  select Resource {
    value
  }
  filter .key = <str>$key
    and .owner.id = <uuid>$owner
))
select resource.value ?? 0
