const mailer = require('nodemailer');
const credentials = require('../creds/config.js');
const model = require('../model/model.js');
const linkGenerator = require('../mailerService/linkGenerator.js');
var mailservice = mailer.createTransport({
    host: 'smtp.gmail.com',
    mailerService: 'gmail',
    auth: {
        user: credentials.gmail.username,
        pass: credentials.gmail.pass,
    }
});

module.exports = {
    sendTransactionMail: async(amount, reason, clientEmail, b_email, link) => { //sends the payment mail to the client
        link = linkGenerator.generateLink(link);
        await mailservice.sendMail({
            from: 'dIGITAlLedgeR',
            to: clientEmail,
            subject: "PAYMENT REQUEST",
            text: reason,
            html: `<h2>Payment REQUEST By `+b_email+`</h1>
                    <br>
                    <h2 style="color:red">Amount :`+amount+`</h4>
                    <br>
                    <h2>Payment Link: `+link+`</h5>
                    <br>`,
        });
    }
}
