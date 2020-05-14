//Importing the Passport & Passport-Local Strategy
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true, //so that we can use req here
    }, async function(req, email, password, done){

        //find user and establish identity
        let user= await User.findOne({email: email});
        
        if (!user) {
            req.flash(
                'error',
                'User Not Found! Please Create an Account.'
            );
            return done(null, false, { message: 'That email is not registered' });
        }
            

        //new match password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            req.flash(
                'error',
                'Invalid UserName or Password'
            );
            return done(null, false, { message: 'Password incorrect' });
        }
    
        return done(null, user);
    }
));

// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserialize the user from the key in the cookie
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err)
        {
            console.log("Error in ==> Passport",err);
            return done(err);
        }
        return done(null, user);
    });
});

//check if the user is authenticated
passport.checkAuthentication=function(req, res, next){
    //if the user signed in then pass the rqst to next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie
        //and we want to send this to locals for the views.
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;
