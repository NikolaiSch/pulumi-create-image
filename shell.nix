{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [ 
      corepack_21
      nodejs_21
      azure-cli
    ];
}
