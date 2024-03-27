with runner := (
  select Runner
  filter .key = <str>$key
),
inviteCode := (
  insert InviteCode {
    runner := runner,
  }
  unless conflict on .runner
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
  filter .identity = runner.identity
),
_delete_identity := (
  delete runner.identity
),
select inviteCode {
  code
};
