with runners := <str>json_array_unpack(<json>$runners)["key"],
dup := (
  delete User
  filter not .isAdmin and .key not in runners
)
select (
  for runner in runners
  union (
    insert User {
      key := runner,
      identity := {}
    }
    unless conflict on .key
  )
)
