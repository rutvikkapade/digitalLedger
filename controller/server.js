const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const session = require('express-session');
const bcrypt = require('bcrypt');
const model = require('../main/model/model.js');
const mailer = require('../main/mailerService/mailer.js');
const payment = require("../main/payment/paymentService.js")
const blockchain = require("../main/blockchain/blockchain.js");
const { mode } = require('crypto-js');
const saltRounds = 10;
app.use(session({ //session details
        secret: 'secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 },
    }))
    //server file routes all the get/post requests 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// '/' home request
app.get('/', (req, res) => {
    if (req.session.username != null) {
        console.log(req.session.username);
        res.sendFile(path.join(__dirname, "public", "html", "dashboard.html"));
    } else {
        res.sendFile(path.join(__dirname, "public", "html", "home.html"));
    }

});
// register route 
app.post('/register', (req, res) => {
    bcrypt.hash(req.body.b_password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        } else {
            model.register(req.body.b_name, req.body.b_owner, req.body.b_email, req.body.b_number, hash);
        }
    })
    res.sendStatus(204);
});
// login route
app.post('/login', async(req, res) => {
    const isUser = await model.login(req.body.l_email);
    if (isUser[0] == true) {
        bcrypt.compare(req.body.l_password, isUser[2], (err, result) => {
            if (err) { console.log(err); } else {
                req.session.username = isUser[1][0].b_email;
                res.sendFile(path.join(__dirname, "public", "html", "dashboard.html"));
            }
        })
    } else { console.log('user not found!'); }
});
// add client route 
app.post('/addClient', (req, res) => {
    model.addClient(req.body.clientName, req.body.clientEmail, req.body.clientMobile, req.session.username);
    res.sendStatus(204);
});
// send transaction route 
app.post('/sendTransactionRequest', async(req, res) => {
    var link = await model.transactionRequest(req.body.amount, req.body.clientEmail, req.session.username, req.body.remarks);
    await mailer.sendTransactionMail(req.body.amount, req.body.reason, req.body.clientEmail, req.session.username, link);
    res.sendStatus(204);
});
// payment route 
app.get('/payment', async(req, res) => {
        var isPresent = await model.isPresent(req.query.unique);
        if (isPresent) {
            res.sendFile(path.join(__dirname, "public", "html", "payment.html"));
        } else {
            res.send('<h3>this url is expired , the payment is complete or declined already</h3>');
        }
    })
    // sign up route
app.get('/signup', (req, res) => {
        res.sendFile(path.join(__dirname, "public", "html", "signUp.html"));
    })
    //login page route 
app.get('/loginPage', (req, res) => {
        res.sendFile(path.join(__dirname, "public", "html", "login.html"))
    })
    //approve payment route
app.post('/approvePayment', (req, res) => {
    payment.processPayment(req.body.unique, req.body.verdict);
    res.send("recieved data at backen");
});
//logout route
app.get('/logout', (req, res) => {
        req.session.username = null;
        res.sendFile(path.join(__dirname, "public", "html", "login.html"));
    })
    //getall route 
app.get('/getall', async(req, res) => {
        const doc = await model.findBusiness(req.session.username);
        res.json(doc);
    })
    // get clients route
app.get('/getClients', async(req, res) => {
    const doc = await model.findBusiness(req.session.username);
    res.send(doc[0].clients);
});
//check validity route
app.post('/checkValidity', async(req, res) => {
        const client = await model.checkClient(req.body.clientEmail, req.session.username);
        const obj = await blockchain.isChainValid(client.clients[0].clientTransactions);
        res.json(obj);
    })
    //port activation
app.listen(port, () => { console.log('server on') });