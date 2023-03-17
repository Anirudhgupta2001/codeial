// // const { use } = require('passport');
// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

// const User= require('../models/user');
// // const  route  = require('../routes');

// let opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secertOrKey: 'codeial'
// }



// passport.use(new JwtStrategy(opts, function(jwtPayLoad, done) {
//     User.findById(jwtPayLoad._id, function(err,user){
//         if(err){
//             console.log('Error in finding user from jwt');
//             return;
//         }
//         if(user){
//             return done(null,user);            
//         }
//         else{
//             return done(null,false);
//         }
//     })
// }));

// module.exports = passport;


const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./enviornment');

const User = require('../models/user');


let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}


passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    User.findById(jwtPayLoad._id, function(err, user){
        if (err){console.log('Error in finding user from JWT'); return;}

        if (user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })

}));

module.exports = passport;