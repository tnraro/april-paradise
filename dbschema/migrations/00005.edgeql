CREATE MIGRATION m14rsida27lry32pn4jm5bsgbgn56w37pye7xuqsyuzmv2kpkorhba
    ONTO m1won7qwjnh5dehrtfj63zq2adsmpl5cybwzaro3qke73o56tw6zia
{
  CREATE TYPE default::Admin EXTENDING default::User {
      CREATE ACCESS POLICY allow_all
          ALLOW ALL ;
      CREATE ACCESS POLICY register_until_session_started
          DENY INSERT USING (((GLOBAL default::game_session).is_started ?? false));
      CREATE REQUIRED PROPERTY is_god: std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::Host {
      DROP ACCESS POLICY allow_all;
      DROP ACCESS POLICY register_until_session_started;
      DROP PROPERTY is_god;
  };
  ALTER TYPE default::User {
      ALTER PROPERTY is_host {
          RENAME TO is_admin;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY is_admin {
          USING (EXISTS ([IS default::Admin]));
      };
  };
  DROP TYPE default::Host;
};
