with key := <str>$key,
inviteCode := (
  insert InviteCode {
    key := key,
  }
  unless conflict on .key
  else (
    update InviteCode
    set {
      code := uuid_generate_v4(),
      createdAt := datetime_of_transaction(),
    }
  )
)
select inviteCode {
  code
};