const { SHA256 } = require('crypto-js');
const utf8=require('utf8');
function calculateHash(amount,remarks,previousHash,timeStamp){
    return SHA256(amount + timeStamp + previousHash+remarks).toString();
}

module.exports={

    addNewBlock :(firstTransaction, amount, previousHash, remarks,timeStamp) =>{
        // var newBlock = {};
        var hash;
        console.log('in hash function');
        if (firstTransaction == 1) {
            amount = utf8.encode(amount);
            remarks = utf8.encode(remarks);
            previousHash =Math.random().toString();
            timeStamp=timeStamp;
        }
        else {
            amount = utf8.encode(amount);
            remarks = utf8.encode(remarks);
            previousHash = previousHash;
            console.log(previousHash);
            timeStamp=timeStamp;
        }
        hash = calculateHash(amount,remarks,previousHash,timeStamp);
        console.log(hash+' '+previousHash);
        return {'hash': hash, 'previousHash': previousHash};
    },
    isChainValid:(chain)=> {
        for (let i = 0; i < chain.length; i++) {
            if (chain[i].hash !== calculatehash(chain[i])) {
                console.log(`Block ${i} has been corrupted`);
                return false;   
            }
            if (i > 0 && chain[i].previousHash !== chain[i-1].hash) {
                console.log(`Block ${i-1} has been corrupted`);
                return false;     
            }
            return true;
        }
    }
}


