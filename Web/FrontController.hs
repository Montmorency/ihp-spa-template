module Web.FrontController where

import IHP.RouterPrelude
import Web.Controller.Prelude
import Web.View.Layout (defaultLayout)
import qualified Data.Text as Text

-- Controller Imports
import Web.Controller.Static
import IHP.LoginSupport.Middleware
import Web.Controller.Sessions
import IHP.DataSync.Types hiding (query)
import IHP.DataSync.Controller
import Web.Controller.Users

instance FrontController WebApplication where
    controllers = 
        [ startPage WelcomeAction
        , parseRoute @SessionsController
        , parseRoute @UsersController
        , webSocketApp @DataSyncController
        , catchAllExceptFrontend WelcomeAction
        -- Generator Marker
        ]

instance InitControllerContext WebApplication where
    initContext = do
        setLayout defaultLayout
        initAuthentication @User


catchAllExceptFrontend action = do
    rest <- remainingText

    if "." `Text.isInfixOf` rest
        then fail "monad"
        else IHP.RouterPrelude.get "" action