CREATE MIGRATION m1duiuh5zup4xjrgfnupagzqiunj7wexzpdbe2wc6rbsl3xxyacwdq
    ONTO m14jjbzke5yrtvnuc57wfspgeyzpprrr47777m6d3rzhvyd5oztuna
{
  ALTER TYPE default::Item {
      CREATE INDEX ON (.category);
  };
  ALTER TYPE default::Mail {
      CREATE INDEX ON (.isReceived);
  };
  ALTER TYPE default::User {
      CREATE INDEX ON (.isAdmin);
      CREATE INDEX ON (.isBanned);
  };
};
