const Comment = require('../models/comment');
const Post = require('../models/post');
const commenstMailer = require('../mailer/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

//This is without async await function having callback hell
// module.exports.create= function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             },function(err,comment){
//                 //handle error
//                 console.log(comment);
//                 post.comments.push(comment);
//                 post.save();
//                 res.redirect('/');
//             });
//         }
//     });
// }

// module.exports.destroy = function(req,res){
//     Comment.findById(req.params.id,function(err,comment){
//         if(comment.user==req.user.id){
//             let postId = comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
//                 return res.redirect('back');
//             })
//         }
//         else{
//             return res.redirect('back');
//         }
//     });
// }

//Modules with async function
module.exports.create = async function(req,res){
    try {
        let post= await Post.findById(req.body.post)    ;
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();
            // comment = await comment.populate('user', 'name email').execPopulate();
            const newComment = await Comment.findById(comment._id).populate('user');           

            // commenstMailer.newComment(newComment);
            let job = await queue.create('email',newComment).save(function(err){
                if(err){
                    console.log('Error in creating a queue');
                    return;
                }
                console.log("Hello");
                console.log(job.id);
            })

            if (req.xhr){
                // Similar for comments to fetch the user's id!
                    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    } catch(err){
        // console.log('error',err);
        req.flash('error', err);
        return;
    }       
}

module.exports.destroy = async function(req,res){
   
    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            
              // CHANGE :: destroy the associated likes for this comment
              await Like.deleteMany({likeable:comment._id, onModel: 'Comment'});
            
            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        // console.log('error', err);
        return;
    }
}
