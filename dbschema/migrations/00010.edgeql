CREATE MIGRATION m1bkymt47advjrsgadwc2vt5ky7slejgxqggabddvlbo4i4lw54wxq
    ONTO m15c4ue6hfee22tesldao5llzmlzms2lztyesxbgsjrichfuqfkbjq
{
  ALTER TYPE default::Achievement {
      CREATE ACCESS POLICY achievement__admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
      CREATE ACCESS POLICY achievement__banned_runner
          DENY ALL USING (((GLOBAL default::currentUser).isBanned ?? false));
      CREATE ACCESS POLICY achievement__self
          ALLOW SELECT, INSERT USING ((GLOBAL default::currentUser ?= .user));
  };
  ALTER TYPE default::Item {
      CREATE ACCESS POLICY item__admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
      CREATE ACCESS POLICY item__banned_runner
          DENY ALL USING (((GLOBAL default::currentUser).isBanned ?? false));
      CREATE ACCESS POLICY item__self
          ALLOW ALL USING ((GLOBAL default::currentUser ?= .owner));
  };
  ALTER TYPE default::Log {
      CREATE ACCESS POLICY log__all
          ALLOW INSERT ;
      CREATE ACCESS POLICY resource__admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
  };
  ALTER TYPE default::Mail {
      CREATE ACCESS POLICY mail__banned_runner
          DENY ALL USING (((GLOBAL default::currentUser).isBanned ?? false));
  };
  ALTER TYPE default::Resource {
      CREATE ACCESS POLICY resource__admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
      CREATE ACCESS POLICY resource__banned_runner
          DENY ALL USING (((GLOBAL default::currentUser).isBanned ?? false));
      CREATE ACCESS POLICY resource__self
          ALLOW ALL USING ((GLOBAL default::currentUser ?= .owner));
  };
  ALTER TYPE default::StaticData {
      CREATE ACCESS POLICY static_data__admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
      CREATE ACCESS POLICY static_data__runner
          ALLOW SELECT ;
  };
  ALTER TYPE default::User {
      CREATE ACCESS POLICY user__all
          ALLOW ALL ;
      CREATE ACCESS POLICY user__banned_runner
          DENY ALL USING (((GLOBAL default::currentUser).isBanned ?? false));
  };
};
