const mysql=require("mysql");
const jwt =require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const session = require("express-session");
const express=require('express');
const bodyparser=require('body-parser');
const nodemailer=require('nodemailer');
const path=require('path');


const app=express();


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    
    auth: {
      user: process.env.my_email,
      pass: process.env.my_password
    }
    
});


const db = mysql.createConnection({
    host:  process.env.DATABASE_HOST,
    user:  process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//login page ke liye
exports.login = async (req,res) =>{
try{
   const {email,password} =req.body;
   if(!email|| !password)
   {
       return res.status(400).render('login',{
           message : 'Please Provide An Email And Password'
       })
   }
   db.query('SELECT * FROM users WHERE email =?',[email],async(error,results) =>{
       console.log(results);
        if(!(results)  || !(await bcrypt.compare(password, results[0].password)))
        {
        res.status(401).render('login',{
            message : 'Email Or Password Is Incorrect'
        })
     }
     else{
        req.session.loggedin = true;
        req.session.name = results[0].name;
        req.session.email = results[0].email;
         const id =results[0].id;
 
         const token = jwt.sign({ id },process.env.JWT_SECRET,{
           expiresIn: process.env.JWT_EXPIRES_IN  
         });
 
      console.log("the token is : "+ token);
 
      const cookieOptions={
          expires: new Date(
              Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 *60 *60 *1000
          ),
         httpOnly:true
      }
      var user = { name:results[0].name, email: results[0].email};
       res.cookie('jwt',token,cookieOptions);
       res.status(200).render("dashboard.ejs",{user:user});
     }
    })
 
 }catch(error) {
     console.log(error);
 }
 }

//otp send k liye
exports.send=(req,res)=>
{
    var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

email=req.session.email;
req.session.otp=otp;
     // send mail with defined transport object
    var mailOptions={
        to: req.session.email,
       subject: "Otp for password change is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('emailotp');
    });
    
}

//otp resend
exports.resend=(req,res)=>
{
    var mailOptions={
        to: req.session.email,
       subject: "Otp for password change is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + req.session.otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('emailotp',{msg:"otp has been sent"});
    });
}

//otp verification
exports.verify=(req,res)=>
{
    if(req.body.otp==req.session.otp){
        res.render('changepassword.ejs',{message:''});
    }
    else{
        res.render('emailotp',{msg : 'otp is incorrect'});
    } 
}

 //change password page k liye
 exports.changepassword=(req,res)=>
 {
    const{password,passwordconfirm } = req.body;
    if(password!=passwordconfirm)
return res.render('changepassword.ejs',{
    message :'Password Do Not Matched'
});
else{
    var email=req.session.email;
     bcrypt.hash(password,8,function(error,hashedPassword){
    console.log(email);
    var sql = "UPDATE users SET password =? WHERE email = ?";
    let data = [hashedPassword, req.session.email];
    db.query(sql,data, (err, result)=>{
      if (err) throw err;
      else{
      console.log(result.affectedRows + " record(s) updated");
      return res.render('changepassword.ejs',{
        message :'Passsword updated successfully'
    });
      }
    });
 });
}
 }
 
 
//register page ke liye   
exports.register = (req,res) =>{
    console.log(req.body);

  const{name,email,sex,state,district,mobileno,password,passwordconfirm } = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], async(error,results) =>{
      if(error){
          console.log(error);
      }
      if(results.length>0){
          return res.render('register',{
              message :'Email Already Used'
          });
      }
      else if(password!=passwordconfirm ){
        return res.render('register',{
            message :'Password Do Not Matched'
        });
      }
      
    else{
        let hashedPasssword = await bcrypt.hash(password,8);
     //console.log(hashedPassword);

     db.query('INSERT INTO users SET ?', {name:name,email:email,sex:sex,state:state,district:district,mobile_no:mobileno,password:hashedPasssword},(error,result)=>{
         if(error)
         {
         console.log(error);
        }
        else{
            console.log(result);
            return res.render('register',{
                message :'User Registered Successfully,Kindly Login'
            });
        }
     });
    }

  });
}