with import <nixpkgs> {};
mkShell {
    buildInputs = [
        docker
        nodejs-18_x
        nodePackages.pnpm
    ];
}
