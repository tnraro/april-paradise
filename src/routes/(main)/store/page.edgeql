with items := json_array_unpack(<json>$items)
select Item {
  key,
  quantity,
}
filter .key in <str>items
