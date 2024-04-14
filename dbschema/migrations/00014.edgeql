CREATE MIGRATION m14wweeapfhvyavebe2ym34qxz2xxtnkuh2xrgmvwqthaeafffm3mq
    ONTO m1r6tlduqd5rxile5hcmefhu4r26lrmz73lqgzenwjz7bdpkiklh5a
{
  ALTER TYPE default::Achievement {
      CREATE INDEX ON (.key);
      CREATE INDEX ON ((.user, .key));
      CREATE INDEX ON (.user);
  };
  ALTER TYPE default::InviteCode {
      CREATE INDEX ON (.user);
      CREATE INDEX ON (.code);
  };
  ALTER TYPE default::Item {
      CREATE INDEX ON (.key);
      CREATE INDEX ON (.owner);
      CREATE INDEX ON ((.owner, .key));
  };
  ALTER TYPE default::Resource {
      CREATE INDEX ON (.key);
      CREATE INDEX ON (.owner);
      CREATE INDEX ON ((.owner, .key));
  };
  ALTER TYPE default::StaticData {
      CREATE INDEX ON (.sheet);
  };
  ALTER TYPE default::User {
      CREATE INDEX ON (.key);
      CREATE INDEX ON (.identity);
  };
};
