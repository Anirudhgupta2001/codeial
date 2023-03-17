const { response } = require('express');
const User=require('../models/user');
//file system
const fs = require('fs');
const path = require('path');

//this controller is kept same as there are less nested callback function

module.exports.profile = function(req,res){
    // res.render('user_profile',{ 
    //     title: "User"
    // });    
    //When we are calling a cookie then we will use cookies and when we are creating a cookie then we will use cookie

    //this code is when we are not using passport 
    // if(req.cookies.user_id){
    //     User.findById(req.cookies.user_id,function(err,user){
    //         if(user){
    //             return res.render('user_profile',{
    //                 title: "User Profile",
    //                 user: user
    //             })
    //         }
    //         return res.redirect('users/sign-in');
    //     });
    // }else{
    //     return res.redirect('users/sign-in')
    // }

    //if we are using passport    
    // if(User){
    //     console.log(User);
    //     return res.render('user_profile', {
    //         title: 'User Profile'
    //     })
    // }    
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:"Codeial",
            profile_user: user
        });
    });
    console.log('No User');
    // return res.redirect('users/sign-in');
}

module.exports.update = async function(req,res){
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     })
    // }
    // else{
        // req.flash('error', 'Unauthorized!');
        // return res.status(401).send('Unauthorized');
    // }
    if(req.user.id = req.params.id){
        try {
            let user =  await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('Multer Error: ',err);
                }
                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    }

                    //this is saving the file path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/'+ req.file.filename;
                    // console.log(User.avatarPath);
                    // console.log(user.avatar);
                }
                user.save();
                // console.log(user);
                return res.redirect('back');
            });
        } catch (error) {
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }     

}

//render the signup page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_signup',{
        title:"Codeial"
    })
}

//render the signin page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_signin',{
        title:"Codeial"
    })
}

//get signup data
module.exports.create = function(req,res){
    // console.log(req.body);
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            // console.log('Error in finding the user',err);
            req.flash('error', err);
            return  
        }
        if(!user){
            User.create({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            },function(err,user){
                if(err){
                    // console.log('Error in creating the user while signing up',err);
                    req.flash('error', err);
                    return
                }
                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('/users/sign-in');
            })
        }
        else{
            
            return res.redirect('back');
        }
    });
}

//get singin data
//this is when we are manually checking 
// module.exports.createSession = function(req,res){
//     //find the user
//     User.findOne({email: req.body.email},function(err,user){
//         if(err){
//             console.log('Error in finding the user');
//             return
//         }
//         //handle user found
//         if(user){
//             if(user.password != req.body.password){
//                 //handle password which don't match
//                 return res.redirect('back');
//             }
//             //handle session creation
//             res.cookie('user_id',user.id);
//             return res.redirect('/users/profile');
//         }else{
//             //handle user not found
//             return res.redirect('back');
//         }
//     })    
// }


//this is the sign in when we are using passport
module.exports.createSession = function(req,res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
      if (err) {
        // req.flash('error',err);
        console.log('Error in logging out the user',err);
        return;            }          
    });         
    // console.log('1');
    req.flash('success', 'You have logged out!');
    return res.redirect('/users/sign-in');
}

// Session can be destoryed in this way too and we need a callback function for logout function
// module.exports.destroySession = function(req, res, next) {
//     req.logout(function(err) {
//       if (err) { return next(err); }
//       res.redirect('/');
//     });
// }