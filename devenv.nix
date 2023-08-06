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
    package = pkgs.nodejs_18;
    corepack.enable = true;
  };

  services.mysql = {
    enable = true;
    package = pkgs.mysql80;
    initialDatabases = [{ name = "co2data-org"; }];
  };

  # See full reference at https://devenv.sh/reference/options/
}
