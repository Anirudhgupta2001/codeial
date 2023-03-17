const nodemailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.newComment = (comment) =>{
    // console.log('New comment mail');
    let htmlString = nodemailer.renderTemplate({comment: comment},'/comments/new_comment.ejs');
    nodemailer.transpoter.sendMail({
        from: 'anirudhgupta.hsr@gmail.com',       
        //this is the reciever ?        
        to: comment.user.email,
        subject: "New comment published",
        // html: '<h1>Yup, your comment is published</h1>'
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        // console.log('Message sent',info);
        return;
    });
}
//kjgvjelbmakgmgon