select assert_single((global current_user[is Admin])) {
  name,
  isGod := .is_god,
}