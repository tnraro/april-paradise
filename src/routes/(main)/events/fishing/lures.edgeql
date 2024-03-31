with resources := (
  select Resource
  filter .owner = global currentUser
)
select {
  lure0 := assert_single((select resources filter .key = '까만 콩 지렁이')).value ?? 0,
  lure1 := assert_single((select resources filter .key = '토깽이 떡밥')).value ?? 0,
  lure2 := assert_single((select resources filter .key = '사우루숭 벌레 유충')).value ?? 0,
}
