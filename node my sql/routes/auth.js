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
router.post('/updateprofile',authController.updateprofile);
router.post('/banking',authController.banking);



router.get('/updateprofile',(req,res) =>{
    console.log(req.session.name);
    console.log(req.session.sex);
    res.render("updateprofile.ejs",{name:req.session.name,email:req.session.email,sex:req.session.sex,district:req.session.district, state:req.session.state, mobileno:req.session.mobileno,message:''});

});

router.get('/organisation',(req,res) =>{
    console.log(req.session.name);
    console.log(req.session.sex);
    res.render("organisation.ejs",{name:req.session.name,email:req.session.email,sex:req.session.sex,district:req.session.district, state:req.session.state, mobileno:req.session.mobileno,message:''});

});
router.get('/banking',(req,res) =>{
    console.log(req.session.name);
    console.log(req.session.sex);
    res.render("banking.ejs",{name:req.session.name,email:req.session.email,sex:req.session.sex,district:req.session.district, state:req.session.state, mobileno:req.session.mobileno,message:''});

});
router.get('/school',(req,res) =>{
    console.log(req.session.name);
    console.log(req.session.sex);
    res.render("school.ejs",{name:req.session.name,email:req.session.email,sex:req.session.sex,district:req.session.district, state:req.session.state, mobileno:req.session.mobileno,message:''});

});
router.get('/road',(req,res) =>{
    console.log(req.session.name);
    console.log(req.session.sex);
    res.render("road.ejs",{name:req.session.name,email:req.session.email,sex:req.session.sex,district:req.session.district, state:req.session.state, mobileno:req.session.mobileno,message:''});

});
router.get('/health',(req,res) =>{
    console.log(req.session.name);
    console.log(req.session.sex);
    res.render("health.ejs",{name:req.session.name,email:req.session.email,sex:req.session.sex,district:req.session.district, state:req.session.state, mobileno:req.session.mobileno,message:''});

});
router.post('/logout',(req,res) =>{
    console.log(req.session.name);
    req.session.destroy();
    res.render('login',{ message :'You Are Logged out'})
});


module.exports = router;