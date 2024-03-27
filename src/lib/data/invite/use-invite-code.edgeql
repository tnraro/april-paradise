with inviteCode := (
  select InviteCode
  filter .code = <uuid>$code
),
runner := inviteCode.runner,
identity := (
  select ext::auth::Identity 
  filter .id = <uuid>$identity
),
_delete_invite_code := (delete inviteCode)
update runner
set {
  identity := identity,
}
