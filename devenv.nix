{ pkgs, ... }:

{

  # https://devenv.sh/packages/
  packages = [ 
    pkgs.docker
    pkgs.nodejs-18_x
    pkgs.nodePackages.pnpm
    pkgs.pscale 
  ];

  dotenv.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
