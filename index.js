const express = require('express');
const env = require('./config/enviornment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helper')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//Used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passsportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash= require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat server
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5001);
console.log('Chat server is listening the port 5001')
const path = require('path');
const { asset_path } = require('./config/enviornment');

if(env.name=='development'){
    app.use(sassMiddleware({
        // src: './assets/scss',
        // dest: './assets/css',
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    })); 
}


app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

// app.use(express.static());
app.use(express.static('./assets'));
//make the upload path avialable to browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode,env.morgan.options));

app.use(expressLayouts);
//extract styles and scripts from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//for setting up the view engine
app.set('view engine','ejs');
app.set('views','./views');


//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    //TODO change the secret before the deployment in production mode
    secret: env.session_cookie_key,
    // secret: 'Ew68CmUvZCtRgu6cXg9KNnIVAcDLiuJG',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*100
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoremove: 'disabled'
        },
        function(err){
            console.log(err || 'connect mongo db setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        //console.log('Error',err);
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})
 