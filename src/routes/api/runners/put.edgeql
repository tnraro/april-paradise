with runners := <json>$runners
for runner in json_array_unpack(runners) union (
  insert User {
    key := <str>runner["key"],
    identity := {}
  }
  unless conflict on .key
)