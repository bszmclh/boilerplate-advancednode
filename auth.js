const passport = require("passport");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const GithubStrategy = require("passport-github").Strategy;

module.exports = (app, myDataBase) => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
            done(null, doc);
        });
    });

    passport.use(
        new LocalStrategy((username, password, done) => {
            myDataBase.findOne({ username: username }, (err, user) => {
                console.log("User: " + username + " attempted to log in");
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        })
    );

    passport.use(
        new GithubStrategy({
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: "https://buttercup-hungry-bongo.glitch.me/auth/github/callback"
            },
            (accessToken, refreshToken, profile, cb) => {
                console.log(profile);


            }
        )
    );
};