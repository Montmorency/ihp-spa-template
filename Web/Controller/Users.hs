module Web.Controller.Users where

import Web.Controller.Prelude

import qualified IHP.AuthSupport.Controller.Sessions as Sessions

instance Controller UsersController where
    action CreateUserAction = do
        let user = newRecord @User
        user
            |> fill @["email", "passwordHash", "firstname", "lastname"]
            |> validateField #email isEmail
            |> validateField #passwordHash nonEmpty
            |> validateField #firstname (hasMaxLength 24)
            |> validateField #lastname (hasMaxLength 24)
            |> validateIsUniqueCaseInsensitive #email
            >>= ifValid \case
                Left user -> renderJson (show user.meta.annotations)
                Right user -> do
                    hashed <- hashPassword user.passwordHash
                    user <- user
                        |> set #passwordHash hashed
                        |> createRecord

                    login user
                    renderJson True

