with data := <json>$data,
recipients := <str>json_array_unpack(data["recipients"]),
isAdmin := global currentUser.isAdmin ?? false
for recipient in recipients
union (
  insert Mail {
    title := <str>data["title"],
    body := <str>data["body"],
    recipient := assert_single((select User filter .id = <uuid>recipient)),
    reward := <str>data["rewards"],
    sender := <str>data["sender"],
  }
)
if isAdmin
else {}
