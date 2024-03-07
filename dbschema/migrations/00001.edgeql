CREATE MIGRATION m123uzlk5zpncfx4dvekqnq56mnzmgcz3lczwk6sf2jdwjbnz7st6a
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::Account {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::Character {
      CREATE REQUIRED LINK owner: default::Account {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY played_sessions: std::int64;
  };
  ALTER TYPE default::Account {
      CREATE MULTI LINK owned_characters := (.<owner[IS default::Character]);
  };
};
