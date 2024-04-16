CREATE MIGRATION m1ylvvuxb6wh25ehv566he26rr647s2ry52qyhzuywfdbndu2ve7yq
    ONTO m1duiuh5zup4xjrgfnupagzqiunj7wexzpdbe2wc6rbsl3xxyacwdq
{
  ALTER TYPE default::Achievement {
      ALTER LINK user {
          RESET default;
      };
  };
  ALTER TYPE default::Item {
      ALTER LINK owner {
          RESET default;
      };
  };
  ALTER TYPE default::Resource {
      ALTER LINK owner {
          RESET default;
      };
  };
};
