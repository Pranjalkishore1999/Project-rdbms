const mysql=require("mysql");
const jwt =require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const db = mysql.createConnection({
    host:  process.env.DATABASE_HOST,
    user:  process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//login page k liye
exports.login = async (req,res) =>{
try{
   const {email,password} =req.body;
   if(!email|| !password)
   {
       return res.status(400).render('login',{
           message : 'please provide an email and password'
       })
   }
   db.query('SELECT * FROM users WHERE email =?',[email],async(error,results) =>{
       console.log(results);
        if(!(results)  || !(await bcrypt.compare(password, results[0].password)))
        {
        res.status(401).render('login',{
            message : 'email or password is incorrect'
        })
     }
     else{
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
       res.cookie('jwt',token,cookieOptions);
       res.status(200).redirect("/dashboard");
     }
    })
 
 }catch(error) {
     console.log(error);
 }
 }
 
//register page ke liye   
exports.register = (req,res) =>{
    console.log(req.body);

  const{name,email,password,passwordconfirm } = req.body;

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

     db.query('INSERT INTO users SET ?', {name:name,email:email,password:hashedPasssword},(error,result)=>{
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