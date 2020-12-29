const express = require('express');
var session = require('express-session');
const authController = require('..//controllers/auth'); 
const  router = express.Router();
const path=require('path');
const bodyparser=require('body-parser');
const multer=require('multer');
const mysql=require("mysql");


const db = mysql.createConnection({
    host:  process.env.DATABASE_HOST,
    user:  process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});




router.post('/register',authController.register);

router.post('/login',authController.login);
router.post('/send',authController.send);
router.post('/resend',authController.resend);

router.post('/verify',authController.verify);
router.post('/changepassword',authController.changepassword);
router.post('/updateprofile',authController.updateprofile);
const uploadImg = require("..//multer");
router.post('/banking',uploadImg().single('image'),function(req,res)
{


    console.log(req.body);
        console.log(req.file);
        console.log(req.body.Category2);

    const filetypes= /pdf/;
        const extname= filetypes.test(path.extname(req.file.originalname).toLowerCase());
        const mimetype=filetypes.test(req.file.mimetype);
        if(mimetype && extname)
        {
            const dep='banking';
            const catogery=req.body.Category2;
            const bn=req.body.bankname;
            const gr=req.body.remarks;
            const pt=req.file.path;
            const id1=req.session.id1;
            const reg= Date.now() + Math.random();
            let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();
var cdate= (year + "-" + month + "-" + date);
            db.query('INSERT INTO banking SET ?', {id:req.session.id1,date:cdate,reg_no:reg,dep:dep,catogery:catogery,bank_name:bn,grievance:gr,document:pt},(error,result)=>{
                if(error)
                {
                console.log(error);
               }
               else{
                   console.log(result);
                   res.render("successfullreg.ejs",{message: 'File uploaded successfully'});

               }
            });
            
        }
            else{
                res.render("banking.ejs",{message: 'only pdfs'});
            }
       // console.log(uploadImg.storage.filename);
        
    
});


//for education
router.post('/school',uploadImg().single('image'),function(req,res)
{


    console.log(req.body);
        console.log(req.file);
        //console.log(req.body.Category2);

    const filetypes= /pdf/;
        const extname= filetypes.test(path.extname(req.file.originalname).toLowerCase());
        const mimetype=filetypes.test(req.file.mimetype);
        if(mimetype && extname)
        {
            const dep='education';
            const catogery=req.body.Category;
            const bn=req.body.SchoolName;
            const gr=req.body.Remarks;
            const pt=req.file.path;
            const id1=req.session.id1;
            const reg= Date.now() + Math.random();
            let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();
var cdate= (year + "-" + month + "-" + date);
            db.query('INSERT INTO education SET ?', {id:req.session.id1,date:cdate,reg_no:reg,dep:dep,catogery2:catogery,school_name:bn,grievance:gr,document:pt},(error,result)=>{
                if(error)
                {
                console.log(error);
               }
               else{
                   console.log(result);
                   res.render("successfullreg.ejs",{message: 'File uploaded successfully'});

               }
            });
            
        }
            else{
                res.render("school.ejs",{message: 'only pdfs'});
            }
       // console.log(uploadImg.storage.filename);
        
    
});




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