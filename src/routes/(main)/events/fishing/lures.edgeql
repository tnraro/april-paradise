with items := (
  select Item
  filter .owner = global currentUser
)
select {
  lure0 := assert_single((select items filter .key = '까만 콩 지렁이')).quantity ?? 0,
  lure1 := assert_single((select items filter .key = '토깽이 떡밥')).quantity ?? 0,
  lure2 := assert_single((select items filter .key = '사우루숭 벌레 유충')).quantity ?? 0,
}
