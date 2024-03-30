{ pkgs, ... }:

{

  # https://devenv.sh/packages/
  packages = [ 
    pkgs.pscale 
  ];

  # Devenv is not able to parse comments in .env files https://github.com/cachix/devenv/issues/80
  dotenv.disableHint = true;

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs;
    corepack.enable = true;
  };

  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15;
    initialDatabases = [{ name = "mydb"; }];
  };

  # See full reference at https://devenv.sh/reference/options/
}
