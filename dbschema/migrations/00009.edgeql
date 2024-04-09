CREATE MIGRATION m15c4ue6hfee22tesldao5llzmlzms2lztyesxbgsjrichfuqfkbjq
    ONTO m1rckxkgex7obl2q2exjskzbdok7lgeywvdzxd5zlhe6lx3tt5egya
{
  ALTER TYPE default::Mail {
      DROP ACCESS POLICY mail__receive;
      ALTER ACCESS POLICY mail__recipient ALLOW SELECT, UPDATE;
  };
};
