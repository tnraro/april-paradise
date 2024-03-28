with user := (
  select User
  filter .key = <str>$key
),
inviteCode := (
  insert InviteCode {
    user := user,
  }
  unless conflict on .user
  else (
    update InviteCode
    set {
      code := uuid_generate_v4(),
      createdAt := datetime_of_transaction(),
    }
  )
),
_delete_factor := (
  delete ext::auth::Factor
  filter .identity = user.identity
),
_delete_identity := (
  delete user.identity
),
select inviteCode {
  code
};
