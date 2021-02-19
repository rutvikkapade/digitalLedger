const { hash } = require('bcrypt');
const { Mongoose } = require('mongoose');

mongoose = require('mongoose');
//mongo connction setup
mongoose.connect('<mongoDb url here>', { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else { console.log('database connection established'); }
})
var ObjectId = mongoose.Schema.ObjectId;
//pendinng transaction schema
var pendingTransactionsSchema = new mongoose.Schema({
    amount: { type: Number, sparse: true },
    clientEmail: { type: String, sparse: true },
    remarks: { type: String, sparse: true },
    b_email: { type: String, sparse: true }
});
//transaction schema
var transactionSchema = new mongoose.Schema({
    amount: { type: Number, trim: true, sparse: true },
    timeStamp: { type: String, trim: true, index: true, sparse: true },
    status: { type: String, sparse: true },
    remarks: { type: String, sparse: true },
    previousHash: { type: String, trim: true, index: true, unique: true, sparse: true },
    hash: { type: String, required: true, trim: true, index: true, unique: true, sparse: true }
});
//client schema
var clientSchema = new mongoose.Schema({
    clientName: { type: String, required: true, sparse: true },
    clientEmail: { type: String, trim: true, index: true, sparse: true },
    clientMobile: { type: Number, trim: true, index: true, sparse: true },
    firstTransaction: { type: Number, required: true },
    clientTransactions: { type: [transactionSchema] }
});
//business schema
var businessSchema = new mongoose.Schema({
    b_id: { type: ObjectId },
    b_name: { type: String, required: true },
    b_owner: { type: String, required: true },
    b_email: { type: String, required: true, unique: true },
    b_mobile: { type: Number, required: true, unique: true },
    b_password: { type: String, required: true },
    clients: { type: [clientSchema] }
});
//models initialized
var business = mongoose.model("Businesses", businessSchema); //business schema model
var pending = mongoose.model("PendingTransactions", pendingTransactionsSchema); // pendingTransaction schema model
var client = mongoose.model("clients", clientSchema); //client schema model
var transaction = mongoose.model("transaction", transactionSchema); //transaction schema model
module.exports = {
    // all model methods
    register: function(b_name, b_owner, b_email, b_mobile, b_password) { //registers businesses
        var newDoc = new business();
        newDoc.b_name = b_name;
        newDoc.b_owner = b_owner;
        newDoc.b_email = b_email;
        newDoc.b_mobile = b_mobile;
        newDoc.b_password = b_password;
        newDoc.firstTransaction = 1;
        newDoc.save();
    },
    login: async(b_email) => { //fetches login creds of users
        var b = [];
        var hash;
        var a = [false, b, hash];
        await business.find({ b_email: b_email }, (err, doc) => {
            if (err) { console.log(err); } else { a[1] = doc; }
        });
        if (a[1].length == 0) { return a; } else {
            a[0] = true;
            a[2] = a[1][0].b_password;
            return a;
        }
    },
    addClient: async(clientName, clientEmail, clientMobile, b_email) => { //adds client to the business's base
        var clientOne = new client();
        clientOne.clientName = clientName;
        clientOne.clientEmail = clientEmail;
        clientOne.clientMobile = clientMobile;
        clientOne.firstTransaction = 1;
        await business.updateOne({ b_email: b_email, 'clients.clientEmail': { $ne: clientOne.clientEmail } }, { $addToSet: { clients: clientOne } }, (err, result) => {
            if (err) { console.log(err); } else {

            }
        });

    },
    transactionRequest: async(amount, clientEmail, b_email, remarks) => { //generates and saves new pending Transaction request
        var newDoc = new pending();
        newDoc.amount = amount;
        newDoc.clientEmail = clientEmail;
        newDoc.b_email = b_email;
        newDoc.remarks = remarks;
        await newDoc.save();
        return newDoc.id;
    },
    isPresent: async(id) => { //checks is a pending transaction request exists or not
        var hashCheck = false;
        const a = await pending.findById(id, (err, result) => {
            if (err) { console.log(err); } else {
                if (result != null) { hashCheck = true; }
            }
        });
        return hashCheck;
    },
    findTransaction: async(id) => { //fetches pending transaction by transaction id
        const doc = await pending.findById(id, (err, result) => {
            if (err) { console.log(err); }
        });
        return doc;
    },
    findBusiness: async(b_email) => { //finds and returns business 
        const bdoc = await business.find({ b_email: b_email });
        return bdoc;
    },
    // updateFirstTransaction: async(b_email) => { ##method depricated##  
    //     await business.updateOne({ b_email: b_email }, { firstTransaction: 0 }, () => {
    //         if (err) { console.log(err); }
    //     });
    // },
    chainTransaction: async(amount, timestamp, remark, hash, previousHash, b_email, clientEmail, status) => { //adds the transaction block to the transaction chain
        var transactionOne = new transaction();
        transactionOne.amount = amount;
        transactionOne.timeStamp = timestamp;
        transactionOne.remarks = remark;
        transactionOne.hash = hash;
        transactionOne.previousHash = previousHash;
        transactionOne.status = status;
        const doc = await business.updateOne({ b_email: b_email, 'clients.clientEmail': clientEmail }, { $addToSet: { 'clients.$.clientTransactions': transactionOne } });
    },
    checkClient: async(clientEmail, b_email) => { //sets client's firstTransaction to false 
        const doc = await business.findOne({ b_email: b_email }, { clients: { $elemMatch: { clientEmail: clientEmail } } });
        await business.updateOne({ b_email: b_email, 'clients.clientEmail': clientEmail }, { '$set': { 'clients.$.firstTransaction': 0 } });
        return doc;
    },
    deletePending: async(unique) => { //deletes pending transaction once the transaction is complete
        await pending.deleteOne({ _id: unique });
    }
}