CREATE MIGRATION m1a3bob37f5kaatvttscbmbmsj4c6l6ah3eaxo4km2der4esieznya
    ONTO m1sdt6q5jru5srnbcoer2tv7qazke7tm6boovi4remw3y633hlbmvq
{
  CREATE GLOBAL default::currentUserId -> std::uuid;
  CREATE GLOBAL default::currentUser := (std::assert_single((SELECT
      default::User
  FILTER
      (.id = GLOBAL default::currentUserId)
  )));
};
