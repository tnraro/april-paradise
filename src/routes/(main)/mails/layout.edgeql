with user := global currentUser,
select Mail {
  id,
  sender,
  title,
  isReceived,
  createdAt,
}
filter .recipient = user
