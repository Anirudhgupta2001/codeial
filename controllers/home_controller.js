const { populate } = require('../models/like');
const Post = require('../models/post');
const User = require('../models/user');

//this is without async function 
// module.exports.home = function(req, res){
//     //return res.end('<h1>Express is up for Codeial!</h1>')
//     // console.log(req.cookies);
//     //by this I can change the value of the cookie
//     // res.cookie('user_id',25);
//     // Post.find({},function(err,post){
//     //     return res.render('home',{
//     //         title:'Codieal | Home',
//     //         posts: posts
//     //     })
//     // })
    
//     //Populate the user of each post
//     Post.find({})
//     .populate('user')
//     .populate({
//         path: 'comments',
//         populate: {
//             path: 'user'
//         }
//     })
//     .exec(function(err,posts){
//         // console.log(posts);
//         User.find({},function(err,users){
//                 return res.render('home',{
//                 title:'Codieal | Home',            
//                 posts: posts,
//                 all_users: users
//             });
//         });         
//     })
// }


//with async function
module.exports.home = async function(req, res){
    try{
                // CHANGE :: populate the likes of each post and comment
        let posts= await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate:{
                path: 'Likes'
            }
        }).populate('comments').populate('likes');

        let users = await User.find({})
        // console.log(posts);
        return res.render('home',{
            title:'Codieal | Home',            
            posts: posts,
            all_users: users
        });
    }
    catch(err){
        console.log('Error',err);
        return;
    }
    
        
    
}


// module.exports.actionName = function(req, res){}
//using then
// Post.find({}).populate('comments').then(function());

//using promises
// let posts = Post.find({}).populate('comments').exec();

// posts.then();