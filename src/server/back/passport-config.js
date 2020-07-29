const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const nedb = require('./neDB');



passport.serializeUser((user, done) => {
    console.log('Сериализация');
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    console.log(`Десериализация ${id}`);
    const user = (nedb.usersDB._id === id) ? nedb : false;
    done(null, user);
});

passport.deserializeUser(async (email, done) => {
    try {
        console.log(`Десериализация ${_id}`);
        const user = await nedb.usersDB.findOne({
            email: email
        });
              if (!user) {
        return done(new Error('user not found'));
      }
        } catch (e) {
      done(e);
    }
  });


passport.use(new LocalStrategy({
    usernameField: 'email'
}, async function (email, password, done) {
    let user = {};
    try {
       await nedb.usersDB.findOne({
                email: email
            })
            .then(function (doc) {
                user = bcrypt.compareSync(password, doc.password) ? doc : '';
            })
            console.log(user);

        if (!user) {
            return done(null, false);
        }
    } catch (e) {
        return done(e);
    }
    return done(null, user);
}));
