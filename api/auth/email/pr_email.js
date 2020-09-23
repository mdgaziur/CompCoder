const nodemailer = require('nodemailer');
const fs = require('fs');

const sendPasswordResetEmail = async (recipient, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    let mailData = {
        from: 'CodeBuddy <codebuddy@codebuddy.cc>',
        to: recipient,
        subject: 'CodeBuddy Password Reset',
        html: `We have received a request for password recovery. If you didn\'t make this request, simply ignore this email. Copy and paste the reset token from bellow to the field where you are asked to give the token. <br/><h1>Reset token:</h1> ${token}`
    }
    await transporter.sendMail(mailData, (err, info) => {
        err ? console.log(err) : console.log('Sent!');
    });
}
module.exports = sendPasswordResetEmail;