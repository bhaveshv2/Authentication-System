const User = require('../models/user');
const nodemailer = require('../config/nodemailer');
const crypto = require('crypto');       //For the generation of token

//to send flash messages using noty js
const Noty = require('noty');

//Profile page controller
module.exports.profile = function(req,res){
    return res.render('user_profile',{
        title:'Authentication System | Profile',
        user:req.user
    });
}

//Signup page controller
module.exports.signUp = async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up',{
        title:'Authentication System | Sign-Up',
        user:req.user,
    });
}

//Signin Page controller
module.exports.signIn =  function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in',{
        title:'Authentication System | Sign-In',
        user:req.user,
    });
}

//Signup controller or registering the user
module.exports.create=async function(req,res){
    try{
        //check for password match
        if(req.body.password!=req.body.confirm_password){
            req.flash('error','Please enter the correct password in the confirm password');
            return res.redirect('back');
        }

        let user = await User.findOne({email:req.body.email});

        //If user is not present then create it
        if(!user){
            await User.create({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
            });

            //Mailing system
            let mailOptions = {
                to:req.body.email,
                subject:'Authentication System | Signed Up',
                text:'Hey '+req.body.name+ '\n\n Your Account has been created, Just signed in and enjoy :)'
            };

            //send the mail
            let mail = await nodemailer.transporter.sendMail(mailOptions);
            if(!mail){
                req.flash('error', 'Error in Sending Mail!');
            }

            req.flash('success','You are registered with us! Check your mail');
            return res.redirect('/users/sign-in');
        }else{
            req.flash('error','User already exist!');
            return res.redirect('/users/sign-in');
        }

    }catch(err){
        console.log("Error",err);
        req.flash('error','Some Error Occoured while signup!');
        return res.redirect('back');
    }
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in successfully');
    
    return res.render('user_profile',{
        title: "Authentication System | Profile",
        user: req.user,
    });
}

//Log Out controller
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success','You have Signed out');
    return res.redirect('/');
}

//forgot password page controller
module.exports.forgotPassword = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_forgot_password',{
        title: 'Authentication System | Forgot Password',
        user: req.user
    });
}

//Forgot password controller
module.exports.forgotPasswordMail = async function(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    //creation of tokens
    let token = await crypto.randomBytes(20).toString('hex');

    let user = await User.findOne({email:req.body.email});

    //check the user is present in the sb or not
    if(!user){
        req.flash('error','No associated account with this email!');
        return res.redirect('back');
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now()+1800000;         //Token will expires in half an hour
    user.save();

    let mailOptions = {
        to:user.email,
        subject:'Authentication System | Forgot Password Mail',
        text:'Hi, \n\n This is mail for the your requested for the forgot password of your account.\n\n'+
        'http://' + req.headers.host + '/users/reset/' + token + '\n\n'
    };

    let mail = await nodemailer.transporter.sendMail(mailOptions);
    if(!mail){
        req.flash('error', 'Error Sending Mail!');
    }

    req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
    return res.redirect('/users/forgot-password');
}

//Reset Form page controller
module.exports.resetForm = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    User.findOne({resetPasswordToken:req.params.token,resetPasswordExpires:{$gt:Date.now()}},function(err,user){
        if(!user){
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/users/forgot-password');
        }
        return res.render('user_password_reset',{
            user:req.user,
            title:'Authentication System | Reset Password',
            token:req.params.token,
        });
    });
}

//Reset using token controller
module.exports.resetUsingToken = async function(req,res){
    try{
        if(req.isAuthenticated()){
            return res.redirect('/users/profile');
        }

        let user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}});

        if(!user){
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
        }

        //Create New Password
        if(req.body.password == req.body.confirm_password){
            user.password=req.body.password;
            user.save();
            req.flash('success', 'Password Changed Successfully!.');
            res.redirect('/users/sign-in');
        }else{
            req.flash("error", "Passwords does not match.");
            return res.redirect('back');
        }
    }catch(err){
        req.flash("error", "Some Error Occoured!");
        res.redirect('/users/forgot-password');
    }
}