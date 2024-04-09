CREATE MIGRATION m1dqpzdvbp3nwk4f5dx7b4jgee2rmf65ary7ux32fzh73aujfdfeiq
    ONTO m1bkymt47advjrsgadwc2vt5ky7slejgxqggabddvlbo4i4lw54wxq
{
  ALTER TYPE default::StaticData {
      DROP ACCESS POLICY static_data__admin;
      DROP ACCESS POLICY static_data__runner;
  };
};
