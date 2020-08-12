const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const app = express()
const {
    PORT = 3000,
        MODE_ENV = 'development',
        SESS_NAME = 'sid',
        SESS_SECRET = `quiet, pal! it's a secret!`
} = process.env
const IN_PROD = MODE_ENV === 'production'

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    store: new FileStore(),
    name: SESS_NAME,
    saveUninitialized: false,
    resave: false,
    secret: SESS_SECRET,

    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: true,
        secure: IN_PROD
    }
}))
const neDB = require('./bc_nedb')

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}
const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/home')
    } else {
        next()
    }
}
app.use((req, res, next) => {
    const {
        userId
    } = req.session
    if (userId) {
        res.locals.user = neDB.getUserByID(userId)
    }
    next()
})

app.get('/', (req, res) => {
    const {
        userId
    } = req.session
    console.log(userId)
    console.log(req.session.cookie)

    res.send(`
    <h1>Welcome!</h1>
    ${userId ? `
    <a href="/home">Home</a>
    <form method= "post" action="/logout">
    <button>Logout</button>
    </form>
    ` : `
    <a href="/Home">Home</a>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
    `}`)
})

app.get('/home', redirectLogin, (req, res) => {
    res.send(`
    <h1>Home</h1>
    <a href="/">Main</a>
    <ul>
        <li>Name: </li>
        <li>Email: </li>
    </ul>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
`)
})

app.get('/login', redirectHome, (req, res) => {
    res.send(`
    <h1>Login</h1>
    <form method ="post" action="/login">
    <input type="email" name="email" placeholder="Email" required/>
    <input type="password" name="password" placeholder="Password" required/>
    <input type="submit"/>
        </form>
        <a href="/">Home</a>
        <a href="/register">Register</a>
    `)
})

app.get('/register', redirectHome, (req, res) => {
    res.send(`
    <h1>Register</h1>
    <form method ="post" action="/register">
    <input type="email" name="email" placeholder="Email" required/>
    <input type="password" name="password" placeholder="Password" required/>
    <input type="submit"/>
        </form>
        <a href="/">Home</a>
        <a href="/login">Login</a>
    `)
})

app.post('/login', redirectHome, (req, res) => {
    const {
        email,
        password
    } = req.body

    neDB.recogniseUser(email, password).then(doc => {
        console.log(doc)
        if (doc) {
            req.session.userId = doc._id
            console.log(`User ${doc._id} auth successful!`)
            return res.redirect('/home')
        }
        res.redirect('/login')
    })
})
app.post('/register', redirectHome, (req, res) => {
    const {
        email,
        password
    } = req.body
    neDB.recogniseUser(email, password).then(doc => {
        console.log(doc)
        if (doc) {
            req.session.userId = doc._id
            return res.redirect('/home')
        } else {
            neDB.addNewUser(email, password)
                .then(result => console.log('User is created.'))
            res.redirect('/register')
        }
    })
})

app.post('/logout', redirectLogin, (req, res) => {
    console.log(req.session)
    console.log(req.session.id)
    console.log(req.get('cookie'))
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home')
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/home')
    })
})

app.listen(PORT, () => console.log(` Server started at http://localhost: ${PORT}`))