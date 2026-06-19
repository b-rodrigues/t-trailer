{
  description = "t-trailer — Intro video for T Orchestration Engine";

  inputs = {
    nixpkgs.url = "github:rstats-on-nix/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages.default = pkgs.buildNpmPackage {
          pname = "t-trailer";
          version = "0.1.0";
          src = pkgs.lib.cleanSourceWith {
            filter = name: type:
              baseNameOf name != "node_modules"
              && baseNameOf name != ".git"
              && baseNameOf name != "result"
              && baseNameOf name != "logo.png";
            src = ./.;
          };

          nodejs = pkgs.nodejs_22;

          npmDeps = pkgs.fetchNpmDeps {
            src = ./.;
            hash = "sha256-+9k3A61rqy44Le7Fq1lcmo9/UqoSGe2XX0AP4MiLH3A=";
          };

          buildPhase = "npm run build";

          installPhase = ''
            mkdir -p $out
            cp -r dist $out/
          '';
        };

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ nodejs_22 ];
          shellHook = ''
            echo "t-trailer dev shell — run 'npm run dev' to start the editor"
          '';
        };
      }
    );
}
