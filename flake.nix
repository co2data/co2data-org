{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  outputs = { self, nixpkgs,flake-utils }: flake-utils.lib.eachDefaultSystem (system: with nixpkgs.legacyPackages.${system}; {
    devShells.default = mkShell {
      buildInputs = [
        docker
        nodejs-18_x
        nodePackages.pnpm
      ];
    };
  });
}
