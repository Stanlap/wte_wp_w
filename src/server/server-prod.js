import path from 'path'
import express from 'express'
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const passport = require('passport')
const userDB = require('./back/neDB')
const countRF = require('./back/vte_brain')
require('./back/config-passport.js')

const app = express()
app.use(express.json())
app.use(express.urlencoded({
                extended: false
            }))
            
app.use(express.static(path.resolve(__dirname, '../dist')))

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

app.get('/', (req, res) => res.send('Hello world'))
app.get('/admin', (req, res) => res.send('Admin page'))

app.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            // return res.render('login', {
            //     title: 'Login',
            //     passMessage: 'Пользователь не идентифицирован.'
            // });
            return res.send('Пользователь не идентифицирован.')
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            // return res.render('mainAuth', {
            //     title: 'Main Page Authenticated'
            // });
            return res.send('Main Page Authenticated')
        });
    })(req, res, next);
});


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})