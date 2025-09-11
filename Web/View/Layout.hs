module Web.View.Layout (defaultLayout, frontendApp, Html) where

import IHP.ViewPrelude
import IHP.Environment
import Generated.Types
import IHP.Controller.RequestContext
import Web.Types
import Web.Routes
import Application.Helper.View

defaultLayout :: Html -> Html
defaultLayout inner = [hsx|
<!DOCTYPE html>
<html lang="en">
    <head>
        {metaTags}

        {stylesheets}
        {scripts}

        <title>{pageTitleOrDefault "App"}</title>
    </head>
    <body>
        <div class="container mt-4">
            {renderFlashMessages}
            {inner}
        </div>
    </body>
</html>
|]

-- The 'assetPath' function used below appends a `?v=SOME_VERSION` to the static assets in production
-- This is useful to avoid users having old CSS and JS files in their browser cache once a new version is deployed
-- See https://ihp.digitallyinduced.com/Guide/assets.html for more details

stylesheets :: Html
stylesheets = [hsx|
    |]

scripts :: Html
scripts = [hsx|
        {when isDevelopment devScripts}
    |]

devScripts :: Html
devScripts = [hsx|
        <script id="livereload-script" src={assetPath "/livereload.js"} data-ws={liveReloadWebsocketUrl}></script>
    |]

metaTags :: Html
metaTags = [hsx|
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta property="og:title" content="App"/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="TODO"/>
    <meta property="og:description" content="TODO"/>
|]

frontendApp :: Html
frontendApp = [hsx| 
        {appRoot}
        <script src={assetPath "/Frontend/main.js"} />
        <link rel="stylesheet" href={assetPath "/Frontend/main.css"}/>
    |]

appRoot :: Html
appRoot = case currentUserOrNothing of
    Just currentUser -> [hsx|<div id="root" data-user-id={inputValue currentUser}/>|]
    Nothing -> [hsx|<div id="root"/>|]