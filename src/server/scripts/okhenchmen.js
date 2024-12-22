const express = require('express');
const session = require("express-session");
const dotenv = require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSIONSECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false }, //lol false
    }),
);

const signupvalidation = require('../scripts/auth/signupvalidation');
const loginvalidation = require('../scripts/auth/loginvalidation');

const requireAuth = (req, res, next) => {
    if (req.session.auth) {
        next();
    } else {
        res.status(401).sendFile(path.resolve("src/client/pages/auth/index.html"));
    }
};

app.use('/scripts', express.static(path.resolve('src/client/scripts')));
app.use('/styles', express.static(path.resolve('src/client/styles')));
app.use('/media', express.static(path.resolve('src/client/media')));

app.use('/landing', express.static(path.resolve('src/client/pages/landing')));
app.use('/auth', express.static(path.resolve('src/client/pages/auth')));

app.get('/', requireAuth, (req, res) => {
    res.status(200).sendFile(path.resolve('src/client/pages/landing/index.html'));
});

app.get('/auth', (req, res) => {
    res.status(200).sendFile(path.resolve('src/client/pages/auth/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on", process.env.PORT);
})

app.use('/signup', async (req, res) => {
    //Handle gRecaptcha
    try {
        var captchaResponse = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `secret=${process.env.GRECAPTCHASECRET}&response=${req.body.token}`,
            },
        );

        let captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
            console.log(captchaResult)
            return res.status(429).json([429, "ERROR: Google ReCaptcha failed!"]);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json([500, "ERROR: Google ReCaptcha failed!"]);
    }

    var response = await signupvalidation.signupvalidation(req.body.username, req.body.type, req.body.password, req.body.confirmpassword);

    res.status(response[0]).json(JSON.stringify(response));
})

app.use('/login', async (req, res) => {
    var response = await loginvalidation.loginvalidation(req.body.username, req.body.password);

    if (response[0] == 200){
        req.session.auth = req.body.username;
    }

    res.status(response[0]).json(JSON.stringify(response));
})