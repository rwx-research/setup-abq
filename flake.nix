# this file installs a reasonable development environment
# see https://gist.github.com/michaelglass/6d1af2cc869268fa7a17820b72ca7e48
# for simple nix setup instructions
{
  description = "development environment for setup-abq";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-22.05";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { system = system; };
      in
      {
        formatter = pkgs.nixpkgs-fmt;
        devShell = pkgs.mkShell {
          packages = with pkgs;
            [
              nodejs
              jq
            ];
        };
      });
}
