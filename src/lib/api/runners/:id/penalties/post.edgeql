with 
runner := (select Runner filter .id = <uuid>$id),
items := json_array_unpack(<json>$penalties)
delete Penalty
filter .id not in <uuid>items["id"] and .user = runner;

with
runner := (select Runner filter .id = <uuid>$id),
items := json_array_unpack(<json>$penalties)
for item in items union (
  with
    id := <uuid>item["id"],
    reason := <str>item["reason"],
    isBanned := <bool>item["isBanned"],
    penalty := (select Penalty filter .id = id)
  select (update Penalty
         filter .id = id
         set {
           isBanned := isBanned,
           reason := reason,
         })
  if exists penalty
  else (insert Penalty {
    isBanned := isBanned,
    reason := reason,
    user := runner,
  })
)