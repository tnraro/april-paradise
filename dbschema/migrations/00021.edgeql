CREATE MIGRATION m127aksjvczswkqtnklzfqbqav26e2sotjrhbtnjt3k3pgz6yc76na
    ONTO m1bo6zjzb25umjmey4j47kftjio62nptdc3y2polgjaxgtv2crvmvq
{
  ALTER TYPE default::User {
      DROP LINK achievements;
      DROP LINK items;
  };
};
