for key in json_array_unpack(<json>$achievements) union (
  insert Achievement {
    key := <str>key,
  }
)
