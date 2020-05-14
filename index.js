//Express Server
const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

//Database Config file
const db = require('./config/mongoose');

//Setup for the passport and session
const session = require('express-session');               // used for session cookie 
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);

//MiddleWare for the flash
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//Middleware for the SaSS/ScSS 
const sassMiddleware =require('node-sass-middleware');

//SCSS Middleware
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

// body parser for req.body
app.use(express.urlencoded({extended: true}));

app.use(express.static('./assets'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'Authentication_System',
    // TODO change the secret before deployment in production mode
    secret: 'AuthenticationSystem',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

//use flash 
app.use(flash());
app.use(customMware.setflash);

//Passport Initialisation
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(expressLayouts);

//extract style and script from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express router
app.use('/', require('./routes'));

//Server Listner
app.listen(port, function(err) {
    if (err) {
      console.log("Error Running the Server", err);
    }
    console.log("Server Running on Port: ", port);
  });
