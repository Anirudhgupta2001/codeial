const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

//This is without async await function having callback hell
// module.exports.create = function(req,res){
//     Post.create({
//     content: req.body.content,
//     user: req.user._id
//     },
//     function(err,post){
//         if(err){
//             console.log('Err in creating a post');
//             return;
//         }
//         return res.redirect('back');
//     });
// }

// module.exports.destroy = function(req,res){
//     Post.findById(req.params.id,function(err,post){
//         if(post.user==req.user.id){
//             post.remove();
//             Comment.deleteMany({post:req.params.id},function(err){
//                 return res.redirect('back');
//             });
//         }
//         else{
//             return res.redirect('back');
//         }
//     })
// }


//Modules with async function
module.exports.create = async function(req,res){
    try{
        let post=await Post.create({
        content: req.body.content,
        user: req.user._id
        });
        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            // post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data:{
                    post: post
                },
                message: "Post created"
            });
        }
        //this won't be in use after using noty in home_post
        req.flash('success', 'Post published!');
        return res.redirect('back');        
    }
    catch(err){

        req.flash('error', err);
        return res.redirect('back');
    }    
}

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        console.log(post);
        if (post.user == req.user.id){
            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            console.log("Heyy");
            await Like.deleteMany({likeable: post._id,onModel: 'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});

            
            post.remove();
            // console.log(req.params.id);
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                req.flash('success', 'Post and associated comments deleted!');

             return res.status(200).json({
                data:{
                    post_id: req.params.id
                },
                message: "Post Deleted"
             })   ;
            }

            // req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}