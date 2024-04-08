with user := global currentUser,
select Mail {
  id,
  sender,
  title,
  body,
  reward,
  isReceived,
  createdAt,
}
filter .id = <uuid>$id and .recipient = user
