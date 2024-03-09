CREATE MIGRATION m13awh4quaccpriy5wx3c2nafmndrlgboljjjftd5zxojohkwjfbxq
    ONTO m1zhytzelpeix46sxus6m2h2jeo4c6irlstvrcfjal7utzknakb36q
{
  ALTER TYPE default::User {
      DROP PROPERTY is_god;
  };
  DROP TYPE default::GginggoTheGod;
  ALTER TYPE default::Host {
      CREATE REQUIRED PROPERTY is_god: std::bool {
          SET default := false;
      };
  };
};
