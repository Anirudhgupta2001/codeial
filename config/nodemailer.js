const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { relative } = require('path');
const env = require('./enviornment');

let transpoter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data,relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('Error in rendering template',err);
            }
            mailHTML = template;
        }

    )

    return mailHTML;
}


module.exports = {
    transpoter:transpoter,
    renderTemplate: renderTemplate
}