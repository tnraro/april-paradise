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
filter .id = <uuid>$id and (user.isAdmin or .recipient = user)
