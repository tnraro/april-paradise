select global currentUser {
  key,
  tokens := [is Runner].tokens ?? 0,
  chips := [is Runner].chips ?? 0,
  isAdmin,
}
