const queue = require('../config/kue');

const commentsMailer = require('../mailer/comments_mailer');

queue.process('email',function(job,done){
    console.log('Emails worker is processing the job',job.data);
    commentsMailer.newComment(job.data);
    done();
}); 

