with runner := global currentUser[is Runner]
update runner
set {
  chips := runner.chips + <int64>$chips
}
