const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        //this function allow us to set first argument as req
        passReqToCallback: true
    },
    function(req,email,password,done){
        //find a user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                //console.log('Error in finding user -> Passport');
                req.flash('error',err);                
                return done(err);
            }
            if(!user || user.password!=password){
                // console.log('Invalid Username/Password');
                req.flash('error','Invalid Username/Password');                
                return done(null,false);
            }
            return done(null,user);
        });
    }
)); 


//serialzing the user to decide which key is to be kept int he cookies
passport.serializeUser(function(user,done){
    done(null,user.id)
});

//deserializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding the user-->passport');
            return done(err);
        }
        return done(null,user);
    });

});

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }   
    return res.redirect('/users/sign-in') ;
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports=passport;