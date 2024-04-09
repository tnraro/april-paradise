CREATE MIGRATION m1rckxkgex7obl2q2exjskzbdok7lgeywvdzxd5zlhe6lx3tt5egya
    ONTO m1irpqonbzjgmvv5zcsdtvcoa4ewof67sczrkpjz5y545gybjwm43a
{
  ALTER TYPE default::Mail {
      ALTER ACCESS POLICY mail__receive ALLOW UPDATE;
  };
};
