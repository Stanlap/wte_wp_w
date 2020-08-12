const path = require('path')
const express = require('express')
const session = require('express-session');
const fileStore = require('session-file-store')(session)
const passport = require('passport');
const app = express()
const PORT = process.env.PORT || 8000

const DIST_DIR = path.resolve(__dirname, '../dist')

require('./back/passport-config');

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(DIST_DIR))
app.use(
    session({
        secret: 'obobNMN23h',
        store: new fileStore(),
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        },
        resave: false,
        saveUninitialized: false
    })
)
app.use(passport.initialize());
app.use(passport.session());
let tAuth = false;
app.post('/login', async (req, res, next) => {
    await passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send('Send correct email or password');
        }
       req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            console.log( req.session);
            console.log(req.isAuthenticated())
            tAuth = req.isAuthenticated();
            function brakeAuth(){
                tAuth = false  
            }
            setTimeout(brakeAuth, 60*60*1000)
            return res.send('Admin page');
        });
    })(req, res, next);
});

const auth = (req, res, next) =>{
    if(tAuth){
   next()
    }  else{
        console.log(req.isAuthenticated())
        return res.redirect('/')
    } 
   }

app.get('/', (req, res) => res.sendFile(`${DIST_DIR}/public/html/main.html`))
app.get('/about_us', (req, res) => res.sendFile(`${DIST_DIR}/public/html/about_us.html`))
app.get('/login', (req, res) => res.sendFile(`${DIST_DIR}/public/html/login.html`))

app.get('/admin', auth, (req, res) => {
    res.send('Admin page')
});

app.get('/logout', (req, res) => {
    console.log('logout', req.session);
req.logout();
tAuth = false;
res.redirect('/');
});
// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/admin' }));

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})