CREATE MIGRATION m1irpqonbzjgmvv5zcsdtvcoa4ewof67sczrkpjz5y545gybjwm43a
    ONTO m1h2tvkrvql4cbwbmumfzuovakyxcpix2yydtb6alslcw2uzm2shta
{
  ALTER TYPE default::Mail {
      CREATE ACCESS POLICY mail__admin
          ALLOW ALL USING (((GLOBAL default::currentUser).isAdmin ?? false));
      CREATE ACCESS POLICY mail__receive
          ALLOW UPDATE READ USING (((GLOBAL default::currentUser ?= .recipient) AND NOT (.isReceived)));
      CREATE ACCESS POLICY mail__recipient
          ALLOW SELECT USING ((GLOBAL default::currentUser ?= .recipient));
  };
};
