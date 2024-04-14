CREATE MIGRATION m1bvvdjcgy2wepntdc63xfxmrwkryvsyzjx35r6pava2o77gabhlla
    ONTO m14wweeapfhvyavebe2ym34qxz2xxtnkuh2xrgmvwqthaeafffm3mq
{
  ALTER TYPE default::Achievement {
      DROP INDEX ON (.key);
      DROP INDEX ON ((.user, .key));
      DROP INDEX ON (.user);
  };
  ALTER TYPE default::InviteCode {
      DROP INDEX ON (.user);
      DROP INDEX ON (.code);
  };
  ALTER TYPE default::Item {
      DROP INDEX ON (.key);
      DROP INDEX ON (.owner);
      DROP INDEX ON ((.owner, .key));
  };
  ALTER TYPE default::Log {
      DROP ACCESS POLICY log__all;
      DROP ACCESS POLICY resource__admin;
  };
  ALTER TYPE default::Resource {
      DROP ACCESS POLICY resource__admin;
      DROP ACCESS POLICY resource__banned_runner;
      DROP ACCESS POLICY resource__self;
      DROP INDEX ON (.key);
      DROP INDEX ON (.owner);
      DROP INDEX ON ((.owner, .key));
  };
  ALTER TYPE default::StaticData {
      DROP INDEX ON (.sheet);
  };
  ALTER TYPE default::User {
      DROP ACCESS POLICY user__all;
      DROP ACCESS POLICY user__banned_runner;
      DROP INDEX ON (.key);
      DROP INDEX ON (.identity);
  };
};
