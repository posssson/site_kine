// server/config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return done(null, false, { message: 'Identifiants incorrects' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return done(null, false, { message: 'Identifiants incorrects' });
    }
    console.log('Password matches');
    return done(null, user);
  } catch (error) {
    console.error('Error during authentication:', error);
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
