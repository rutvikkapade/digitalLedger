const model=require('../model/model.js');
const blockchain=require('../blockchain/blockchain.js');
module.exports={
processPayment : async(unique,verdict)=>{
const transaction=await model.findTransaction(unique);

const bdoc=await model.findBusiness(transaction.b_email);
console.log(transaction);
const clientBase=await model.checkClient(transaction.clientEmail,transaction.b_email);
var status="Declined";
if(verdict=='true'){status="Approved";}
var timeStamp=String(new Date());
console.log(clientBase);
var chainLength=clientBase.clients[0].clientTransactions.length;
console.log(chainLength);
var previousHash="randomisedMetaBase7";
if(chainLength!=0){previousHash=clientBase.clients[0].clientTransactions[chainLength-1].hash};
var hash=blockchain.addNewBlock(clientBase.clients[0].firstTransaction, transaction.amount, previousHash, transaction.remarks,timeStamp);
await model.chainTransaction(transaction.amount,timeStamp,transaction.remarks,hash.hash,hash.previousHash,bdoc[0].b_email,transaction.clientEmail,status);
// await model.deletePending(unique);
}
}