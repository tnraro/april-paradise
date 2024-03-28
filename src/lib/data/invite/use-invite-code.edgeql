with inviteCode := (
  select InviteCode
  filter .code = <uuid>$code
),
user := inviteCode.user,
identity := (
  select ext::auth::Identity 
  filter .id = <uuid>$identity
),
_delete_invite_code := (delete inviteCode)
update user
set {
  identity := identity,
}
