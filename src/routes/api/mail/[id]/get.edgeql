select Mail {
  id,
  sender,
  title,
  body,
  reward,
  isReceived,
  createdAt,
}
filter .id = <uuid>$id 
