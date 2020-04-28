// importing necessary modules
const nodemailer = require('nodemailer');

// importing libs
const logger = require('./loggerLib');

let sendEmail = function (email, subject, body) {
    const transport = {
        service: 'gmail',
        auth: {
            user: "nodemailer.webchat@gmail.com",  // generated ethereal user
            pass: "nodemailer"  // generated ethereal password
        }
    };

    let transporter = nodemailer.createTransport(transport);

    let mailOptions = {
        from: '"Group Chat" <nodemailer.webchat@gmail.com>',    // sender address
        to: email,
        subject: subject,
        html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            logger.error(error, "Mailer", 10);
        }
    });

}

let signUpEmail = function(email, firstname) {
    let html = `Thank You for signing up at webchat ${firstname}. Have fun chatting with your mates!`;
    sendEmail(email, "Welcome Email", html);
};

let forgotPassEmail = function (email, passResetToken) {
    let html = `<p>Ohh.. did you forget your pass? No worries! Simply click on the below link <br> <a href='http://localhost:4200/reset-password?token=${passResetToken}'>Link</a></p>`;
    sendEmail(email, 'Password Reset', html);
};

module.exports = {
    sendEmail: sendEmail,
    signUpEmail: signUpEmail, 
    forgotPassEmail: forgotPassEmail
};