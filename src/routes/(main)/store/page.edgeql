with items := json_array_unpack(<json>$items)
select Item {
  key,
  quantity,
}
filter .owner = global currentUser and .key in <str>items