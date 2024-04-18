with data := <json>$data,
users := <uuid>json_array_unpack(data["users"])
update User
filter .id in users
set {
  isBanned := <bool>data["ban"],
}
