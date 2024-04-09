CREATE MIGRATION m1h2tvkrvql4cbwbmumfzuovakyxcpix2yydtb6alslcw2uzm2shta
    ONTO m1qyvutthy2mpqyk57ye6v4y3lxlkb2riz53vaiqlxcvhu7b4c3rwq
{
  ALTER TYPE default::User {
      ALTER LINK inventory {
          RENAME TO items;
      };
  };
};
