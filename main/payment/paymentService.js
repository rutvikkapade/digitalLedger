const model = require('../model/model.js');
const blockchain = require('../blockchain/blockchain.js');
module.exports = {
    processPayment: async(unique, verdict) => { //processes payment request
        const transaction = await model.findTransaction(unique); //fetches transaction from transaction id
        const bdoc = await model.findBusiness(transaction.b_email); //fetches business details
        const clientBase = await model.checkClient(transaction.clientEmail, transaction.b_email); //fetches client details
        var status = "Declined";
        if (verdict == 'true') { status = "Approved"; } //sets status approved if transaction was approved
        var timeStamp = String(new Date());
        var chainLength = clientBase.clients[0].clientTransactions.length; //computes transaction chain length
        var previousHash = "randomisedMetaBase7";
        if (chainLength != 0) { previousHash = clientBase.clients[0].clientTransactions[chainLength - 1].hash }; //sets previous hash through previous transaction block
        var hash = await blockchain.addNewBlock(clientBase.clients[0].firstTransaction, transaction.amount, previousHash, transaction.remarks, timeStamp); //generates new transaction block hashes
        await model.chainTransaction(transaction.amount, timeStamp, transaction.remarks, hash.hash, hash.previousHash, bdoc[0].b_email, transaction.clientEmail, status); //adds the new transaction block to transaction chain
        await model.deletePending(unique); //deletes the pending transaction 
    }
}