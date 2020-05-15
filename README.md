# Authentication-System
## Description
An Authentication System with the the functionality of sending mail on signup and forget password.

## Requirement
1. NodeJS
2. MongoDB


## Dependencies Used 
1. npm install express
2. npm install mongoose
3. npm install node-sass-middleware
4. npm install passport
5. npm install nodemon
6. npm install passport-local (passport strategy used for authorization: Local Strategy)
7. npm install ejs
8. npm install noty (For the flash Messages)
9. npm install crypto
10. npm install bcryptjs (For encryting the password and store it into the db)
11. npm install express-ejs-layouts
12. npm install express-session
13. npm install nodemailer
14. npm install dotenv  (for storing the env variable like the email and password from which the mail is send)
15. npm install connect-flash
16. npm install connect-mongo


## Setup and Execution
1. Clone this repository.
2. Install above given dependencies.
3. For Naive testing, (base url - http://localhost:8000
   - Start the server by 'npm start' and test using postman services

## Routes Used
```
1. /GET    '/'
  -This route is used for Homepage.
  
2. /GET    '/users/profile'
  -This route is used for Profile page of the user.
  
3. /GET    '/users/sign-up'
  -This route is used for Sign Up Page

4. /get    '/users/sign-in'
  -This route is used for Sign In Page.
  
5. /POST   '/users/create'
  -This route is used for Creating a new user.
  -This is the form for creating the user profile automatically fetched in Sign Up page.

6. /POST   '/users/create-session'
  -This route is used for Signing In the registered user using creating the session.
  -This is the form for signing in to the user profile automatically fetched in Sign In page. 
  
7. /GET    '/users/sign-out'
  -This route is used for signing out from the session means destroy the session estaiblished at the time of signing in.
  
8. /GET    '/users/forgot-password'
  -This route is used for rendering the page of forgot password.
  
9. /POST   '/users/forgot-password-mail'
  -This route is used for sending the mail of reset link of forgot password with token.
  
10. /GET   '/users/reset/:token'
  -This route is get request route which is link of reseting the password link with the token.
  
11. /POST  '/users/reset/:token'
  -This route is post request route which is generted by the above link using the same token so that token get verified.
  
12. /POST  '/users/update-password'
  -This route is used to reset the password after login.
```


