const path = require('path');
const express = require('express');
const config = require('./config.json')
const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

//const { myRoutes } = require('./routes/test');

const app = express();

const options = {
    identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
    issuer: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.audience,
    validateIssuer: config.settings.validateIssuer,
    passReqToCallback: config.settings.passReqToCallback,
    //loggingLevel: config.settings.loggingLevel, // not specifying loglevel means it is turned off
    isB2C: config.settings.isB2C,
    //,scope: config.resource.scope
    //,    proxy: { port: 'proxyport', host: 'proxyhost', protocol: 'http' },
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    // Send user info using the second argument
    done(null, {}, token);
}
);

app.use(passport.initialize());
passport.use(bearerStrategy);

// enable CORS (for testing only -remove in production/deployment)
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

async function authMiddleware(req, res, next) {
    passport.authenticate('oauth-bearer', { session: false });
    next();
};

// API endpoint exposed
app.get("/api", passport.authenticate('oauth-bearer', { session: false }),
    (req, res) => {
        res.status(200).send("Hello world")
    });

//original
// app.get("/api",
//     passport.authenticate('oauth-bearer', { session: false }),
//     (req, res) => {
//         //console.log('Validated claims: ', req.authInfo);
//         // Service relies on the name claim.  
//         res.status(200).json({
//             //'name': req.authInfo['name'],
//             'issued-by': req.authInfo['iss'],
//             'issued-for': req.authInfo['aud'],
//             //'scope': req.authInfo['scp']
//         });
//     }
// );

app.get('/api/test', authMiddleware, (req, res) => {
    res.status(200).send("test");
});

app.get('/healthz', (req, res) => {
    res.status(200).send("status ok");
});

const port = process.env.PORT || 6000;

app.listen(port, () => {
    console.log("Listening on port " + port);
});


