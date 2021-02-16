const model=require('../model/model.js');

module.exports={
processPayment : async(unique,verdict)=>{
const transaction=await model.findTransaction(unique);
console.log(transaction.b_email);

const bdoc=await model.findBusiness(transaction.b_email);
console.log(bdoc);
var status="Declined";
if(verdict==true){status="Approved";}
//var hash=blockchain.computeHash(transaction[0].amount,timestamp = String(new Date()),status,previousHash,b_doc[0].firstTransaction);
var timestamp=String(new Date());
var hash="fijifjfwjfijf";
var previousHash="jwwjffjjfijfjjf"
var amount=transaction.amount;
var remark="hello buddy";
await model.chainTransaction(amount,timestamp,remark,hash,previousHash,bdoc.b_email);
//await model.deletePending(unique);
}
}