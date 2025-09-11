{
    inputs = {
        ihp.url = "github:digitallyinduced/ihp/v1.4";
        nixpkgs.follows = "ihp/nixpkgs";
        flake-parts.follows = "ihp/flake-parts";
        devenv.follows = "ihp/devenv";
        systems.follows = "ihp/systems";
    };

    outputs = inputs@{ self, nixpkgs, ihp, flake-parts, systems, ... }:
        flake-parts.lib.mkFlake { inherit inputs; } {

            systems = import systems;
            imports = [ ihp.flakeModules.default ];

            perSystem = { pkgs, system, config, ... }: {
                ihp = {
                    appName = "ihp-spa"; # Change this to your project name
                    enable = true;
                    projectPath = ./.;
                    packages = with pkgs; [
                        # Native dependencies, e.g. imagemagick
                    ];
                    haskellPackages = p: with p; [
                        # Haskell dependencies go here
                        p.ihp
                        cabal-install
                        base
                        wai
                        text

                        # Uncomment on local development for testing
                        # hspec
                    ];
                };

                # Custom configuration that will start with `devenv up`
                devenv.shells.default = {
                    # Start Mailhog on local development to catch outgoing emails
                    # services.mailhog.enable = true;

                    # Custom processes that don't appear in https://devenv.sh/reference/options/
                    processes = {
                        frontend.exec = ''
                                mkdir -p static/Frontend

                                touch Frontend/src/index.tsx # Force rebuild

                                cd Frontend
                                NODE_PATH=${config.devenv.shells.default.env.NODE_PATH} ${pkgs.esbuild}/bin/esbuild src/index.tsx --bundle --loader:.woff=file --loader:.woff2=file --loader:.ttf=file --loader:.svg=file --loader:.png=file --loader:.gif=file --main-fields=module,main --define:global=globalThis --outfile=../static/Frontend/main.js --watch
                            '';
                        tailwind.exec = "cd Frontend && ./node_modules/.bin/tailwindcss -i ./src/styles/globals.css -o ./src/tailwind.css --watch";
                    };

                    scripts.update-typescript-types.exec = ''
                        ${ihp.packages.${system}.datasync-typescript}/bin/generate-datasync-types Application/Schema.sql Frontend/types/ihp-datasync/index.d.ts
                    '';

                    env.NODE_PATH =
                        let ihpNodeModules = pkgs.linkFarm "ihp-node-modules" [ { name = "ihp-datasync"; path = "${ihp}/ihp/data/DataSync"; } ];
                        in "${ihpNodeModules}:node_modules";
                };



                packages.frontend =
                    let
                        node-modules = pkgs.mkYarnModules {
                            pname = "${config.ihp.appName}-frontend-deps";
                            packageJSON = ./Frontend/package.json;
                            yarnLock = ./Frontend/yarn.lock;
                            version = "1.0.0";
                        };
                        filter = ihp.inputs.nix-filter.lib;
                    in pkgs.stdenv.mkDerivation {
                        name = "${config.ihp.appName}-frontend";
                        src = filter {
                            root = ./Frontend;
                            include = ["src" "lib" "hooks" "components" "types" (filter.matchExt "js") (filter.matchExt "ts") (filter.matchExt "tsx") (filter.matchExt "json") (filter.matchExt "css")];
                            exclude = ["node_modules"];
                        };
                        nativeBuildInputs = [pkgs.yarn node-modules pkgs.esbuild];
                        buildPhase = ''
                        ln -s ${node-modules}/node_modules ./node_modules
                        export PATH="node_modules/bin:$PATH"

                        mkdir -p ihp-node_modules
                        ln -s ${ihp}/ihp/data/DataSync ihp-node_modules/ihp-datasync

                        ${node-modules}/node_modules/.bin/tailwindcss -i ./src/styles/globals.css -o ./src/tailwind.css

                        NODE_PATH=ihp-node_modules:node_modules ${pkgs.esbuild}/bin/esbuild src/index.tsx \
                            --preserve-symlinks \
                            --bundle \
                            --loader:.woff=file \
                            --loader:.woff2=file \
                            --loader:.ttf=file \
                            --loader:.svg=file \
                            --loader:.png=file \
                            --loader:.gif=file \
                            --main-fields=module,main \
                            --define:global=globalThis \
                            --define:process.env.NODE_ENV=\"production\" \
                            --minify \
                            --legal-comments=none \
                            --outfile=$out/main.js
                        '';
                        allowedReferences = [];
                    };
            };

        };

    # Add own cachix cache here to speed up builds.
    # Uncomment the following lines and replace `CHANGE-ME` with your cachix cache name
    # nixConfig = {
    #     extra-substituters = [
    #         "https://CHANGE-ME.cachix.org"
    #     ];
    #     extra-trusted-public-keys = [
    #         "CHANGE-ME.cachix.org-1:CHANGE-ME-PUBLIC-KEY"
    #     ];
    # };
}
