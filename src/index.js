require('dotenv').config()
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

const app = express();
const port = process.env.PORT || 3000;

passport.use(
    new OAuth2Strategy(
        {
            authorizationURL: process.env.OAUTH_AUTORIZE_ENDPOINT,
            tokenURL: process.env.OAUTH_TOKEN_ENDPOINT,
            clientID: process.env.OAUTH_CLIENT_ID,
            callbackURL: process.env.OAUTH_CALLBACK_URL,
            scope: ['openid'],
        },
        (accessToken, refreshToken, profile, cb) => {
            console.log('');
            console.log(`Access Token: ${accessToken}`);
            console.log('');
            console.log(`Refresh Token: ${refreshToken}`);
            return cb(null, profile);
        }
    )
);

app.use(passport.initialize());

// https://docs.microsoft.com/en-us/azure/active-directory-b2c/authorization-code-flow#1-get-an-authorization-code
app.get('/auth', passport.authenticate('oauth2'));

// https://docs.microsoft.com/en-us/azure/active-directory-b2c/authorization-code-flow#1-get-an-authorization-code
app.get(
    '/auth/callback',
    passport.authenticate('oauth2', {
        failureRedirect: '/',
        session: false,
    }),
    (req, res) => {
        res.send('Login efetuado com sucesso!')
    }
);


app.get('/', (req, res) => {
    console.log(req, res);
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
