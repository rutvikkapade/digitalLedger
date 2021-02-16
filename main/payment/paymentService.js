const model=require('./model/model.js');

module.exports={
processPayment : async(unique,verdict)=>{
var transaction=await model.findTransaction(unique);
var b_doc=await model.findBusiness(transaction[0].b_email);
var status="Declined";
if(verdict==true){status="Approved";}
var hash=blockchain.computeHash(transaction[0].amount,timestamp = String(new Date()),status,previousHash,b_doc[0].firstTransaction);
}
}