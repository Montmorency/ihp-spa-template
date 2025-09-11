module Config where

import IHP.Prelude
import IHP.Environment
import IHP.FrameworkConfig
import qualified IHP.DataSync.Role as Role

config :: ConfigBuilder
config = do
    -- See https://ihp.digitallyinduced.com/Guide/config.html
    -- for what you can do here
    addInitializer Role.ensureAuthenticatedRoleExists
    pure ()