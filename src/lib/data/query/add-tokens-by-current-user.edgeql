with runner := global currentUser[is Runner]
update runner
set {
  tokens := runner.tokens + <int64>$tokens
}
