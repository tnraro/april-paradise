CREATE MIGRATION m1s5ot4zbqq7e2yi4lpnemefvtzkh6nejxvcbdl5y6isdqgphwec3a
    ONTO m1v2xljs4fdztj6lzlksfsm5lhpn4mgixv4g6ngz2f7mjkdlkznfya
{
  CREATE TYPE default::StaticData {
      CREATE REQUIRED PROPERTY data: std::str;
      CREATE REQUIRED PROPERTY sheet: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
