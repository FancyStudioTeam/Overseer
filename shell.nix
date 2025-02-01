{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.pnpm
    pkgs.biome
  ];

  shellHook = ''
    export IN_NIX_SHELL=1
    export BIOME_BIN_PATH=$(which biome)

    echo "Node.js: $(node -v) - PNPM: $(pnpm -v) - Biome: $(biome --version)"
  '';
}
