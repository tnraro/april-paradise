CREATE MIGRATION m1vj4rluvz3gnbkmp5yotf6q37l643uesshsqx2746rjwcrphkhwoq
    ONTO m12ua76pyiyr2ki6npqbcyjtg7nnse66ym3dm2kxiqurtqjoxldywq
{
  ALTER TYPE default::Event {
      CREATE ACCESS POLICY admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
      CREATE ACCESS POLICY user_can_select
          ALLOW SELECT USING (EXISTS (GLOBAL default::currentUser));
  };
  ALTER TYPE default::Penalty {
      CREATE ACCESS POLICY admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
      CREATE ACCESS POLICY self
          ALLOW SELECT USING ((GLOBAL default::currentUser ?= .user));
  };
};
