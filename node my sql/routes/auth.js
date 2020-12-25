const express = require('express');
var session = require('express-session');
const authController = require('..//controllers/auth'); 
const  router = express.Router();

router.post('/register',authController.register);

router.post('/login',authController.login);
router.post('/send',authController.send);
router.post('/resend',authController.resend);

router.post('/verify',authController.verify);
router.post('/changepassword',authController.changepassword);


router.get('/updateprofile',(req,res) =>{
    console.log(req.session.name);

    res.render("updateprofile.ejs",{name:req.session.name,email:req.session.email});

});
router.post('/logout',(req,res) =>{
    console.log(req.session.name);
    req.session.destroy();
    res.render('login',{ message :'You Are Logged out'})
});


module.exports = router;