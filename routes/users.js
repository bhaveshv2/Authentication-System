//Setup express router
const expess=require('express');
const router=expess.Router();

//import passport for authentication
const passport=require('passport');

//import the user controller
const usersController=require('../controllers/user_controller');

router.get('/profile', passport.checkAuthentication ,usersController.profile);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.get('/forgot-password', usersController.forgotPassword);
router.post('/forgot-password-email', usersController.forgotPasswordMail);

router.post('/create',usersController.create);
//use passport as a middleware to auth
router.post('/create-session',passport.authenticate('local', {failureRedirect: '/users/sign-in'}), usersController.createSession);

router.get('/reset/:token', usersController.resetForm);
router.post('/reset/:token', usersController.resetUsingToken);

router.get('/sign-out', usersController.destroySession);

module.exports = router;