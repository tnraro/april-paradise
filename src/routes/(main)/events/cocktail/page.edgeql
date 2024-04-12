with places := (
  select Resource
  filter .key like "cocktail-place-%"
)
select places.key
