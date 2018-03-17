const app = require('../server.js');
const config = require('../config.js');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


// exports.fbLogin = function(req, res){
//   console.log('fbLogin saying now haha idk');
//   passport.authenticate('facebook', { scope: 'email'})(req, res);
// }
//
// exports.fbCallback = function(req, res){
//    passport.authenticate("facebook", { failureRedirect: '/#/', successRedirect:'/#/login-success'})(req, res);
// }

module.exports = {

  fbLogin: function(req, res){
    passport.authenticate('facebook', { scope: 'email'})(req, res);
  },

  fbCallback:function(req, res){
     passport.authenticate("facebook", { failureRedirect: '/#/', successRedirect:'/#/login-success'})(req, res);
  },

  localLogin: function(req, res, next){
    passport.authenticate('local-login', function(err, user, info){
      if (err){
        return next(err);
      }
      // Generate a JSON response reflecting authentication status
      if (!user) {
        return res.send({ success : false, message : info.message });
      }

      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.send({ success : true, message : 'authentication succeeded' });
      });
    })(req, res)
  },

  localSignup: function(req, res, next){
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (! user) {
        return res.send({ success : false, message : info.message });
      }

      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.send({ success : true, message : 'authentication succeeded' });
      });
    })(req, res, next);
  }
}


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    if(user[0]) {
      user = user[0];
    }
    done(null, user);
});


passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
  function(req, email, password, done) {
    const db = app.get('db');

    db.users.findOne({ email: email }).then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      if(user.facebookid){
        return done(null, false, { message: 'This email has already been signed up through Facebook. Please login with Facebook to continue' });
      }
      bcrypt.compare(password, user.pass_hash, (err, comparedValue) => {
        if(comparedValue === false || comparedValue === undefined || comparedValue === null){

          return done(null, false, { message: 'Incorrect email or password' });
        } else {
          return done(null, user);
        }
      })
    });
  }
));


passport.use('local-signup', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
  function(req, email, password, done) {

    let r = req.body;
    db.users.findOne({ email: email }).then(user => {
      // if (err) { return done(err); }
      if (user) {
        if (user.facebookid){
          return done(null, false, {message: 'This email has already been signed up through Facebook. Please login with Facebook to continue'})
        }
        return done(null, false, {message: 'Email is already being used'});
      } else {
        bcrypt.hash(password, 10, function(err, hash) {
          db.users.insert({firstname: r.firstname, lastname: r.lastname, email: req.body.email, pass_hash: hash, registered: moment().format()}).then(newUser => {
            // if(err){}
            return done(null, newUser)
          })
        });
      }
    });
  }
));


passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
    const db = app.get('db');

    var user = {
      profile: profile,
      token: accessToken
    }

    try {
      db.get_user_by_fbid([profile.id]).then(user => {
        let firstName = profile.name.givenName;
        let lastName = profile.name.familyName;
        let email = profile.emails[0].value;
        let id = profile.id;

        if (!user[0]) {
          db.add_user([firstName, lastName, email, id]).then(user => {
            console.log("add_user");
            done(null, user);
          })
        } else {
          console.log("not a new users");
          done(null, user)
        }
      });

    }
    catch(err){
      console.log('get facebook user error', err);
      return done(err)
    }

  }
));


// app.get("/auth/facebook", passport.authenticate('facebook', { scope: 'email'}));
// app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: '/#/', successRedirect:'/#/login-success'}))
