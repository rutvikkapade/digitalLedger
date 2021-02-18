const { SHA256 } = require('crypto-js');
const bcrypt = require('bcrypt');

module.exports = {

    addNewBlock: async(firstTransaction, amount, previousHash, remarks, timeStamp) => {
        // var newBlock = {};
        var hash;
        console.log('in hash function');
        if (firstTransaction == 1) {
            amount = amount;
            remarks = remarks;
            previousHash = Math.random().toString();
            timeStamp = timeStamp;
        } else {
            amount = amount;
            remarks = remarks;
            previousHash = previousHash;
            timeStamp = timeStamp;
        }
        str = amount + remarks + previousHash + timeStamp;
        const hashOne = SHA256(str);
        return { 'hash': hashOne, 'previousHash': previousHash };
    },
    isChainValid: async(chain) => {
        for (let i = 0; i < chain.length; i++) {
            str = chain[i].amount + chain[i].remarks + chain[i].previousHash + chain[i].timeStamp;
            hash = SHA256(str);
            if (chain[i].hash != hash) {
                // console.log(`Block ${i} has been corrupted`);
                return { 'isOk': false, 'index': i };
            }
            if (i > 0 && chain[i].previousHash != chain[i - 1].hash) {
                // console.log(`Block ${i - 1} has been corrupted`);
                return { 'isOk': false, 'index': i };
            }

        }
        return { 'isOk': true };
    }
}