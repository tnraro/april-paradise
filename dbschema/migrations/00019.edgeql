CREATE MIGRATION m1ewb2fcp3w76xswx6syhypd4tzbn2qj5xo3nga5cvzcuqi2jothma
    ONTO m1ylvvuxb6wh25ehv566he26rr647s2ry52qyhzuywfdbndu2ve7yq
{
  CREATE GLOBAL default::currentUserId -> std::uuid;
  ALTER GLOBAL default::currentUser USING (std::assert_single((SELECT
      default::User
  FILTER
      (.id = GLOBAL default::currentUserId)
  )));
  ALTER TYPE default::Item {
      ALTER LINK owner {
          SET default := (GLOBAL default::currentUser);
      };
  };
  ALTER TYPE default::Resource {
      ALTER LINK owner {
          SET default := (GLOBAL default::currentUser);
      };
  };
  ALTER TYPE default::Achievement {
      ALTER LINK user {
          SET default := (GLOBAL default::currentUser);
      };
  };
};
