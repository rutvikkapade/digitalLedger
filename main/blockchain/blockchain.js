const { SHA256 } = require('crypto-js');
const bcrypt = require('bcrypt');

module.exports = {

    addNewBlock: async(firstTransaction, amount, previousHash, remarks, timeStamp) => { //generates new block hashes
        var hash;
        if (firstTransaction == 1) { //executes only if firstTransaction is set to true
            amount = amount;
            remarks = remarks;
            previousHash = Math.random().toString(); //random previous hash for the very first transaction
            timeStamp = timeStamp;
        } else { //executes only if firstTransaction is set to false
            amount = amount;
            remarks = remarks;
            previousHash = previousHash;
            timeStamp = timeStamp;
        }
        str = amount + remarks + previousHash + timeStamp;
        const hashOne = SHA256(str); //computes new hash
        return { 'hash': hashOne, 'previousHash': previousHash };
    },
    isChainValid: async(chain) => {
        for (let i = 0; i < chain.length; i++) { //checks transaction chain validity
            str = chain[i].amount + chain[i].remarks + chain[i].previousHash + chain[i].timeStamp;
            hash = SHA256(str); //recomputes hash of the data in transaction chain
            if (chain[i].hash != hash) { //returns false and index of compromised block
                return { 'isOk': false, 'index': i };
            }
            if (i > 0 && chain[i].previousHash != chain[i - 1].hash) { //compares previous hash and hash of two block consecutive blocks
                return { 'isOk': false, 'index': i }; //returns false and index of compromised block

            }

        }
        return { 'isOk': true }; // returns true if there is no tampering in data
    }
}