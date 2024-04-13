with places := (
  select Resource
  filter .key like "cocktail-place-%"
    and .owner = global currentUser
)
select places.key
