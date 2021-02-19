module.exports = {
    generateLink: (link) => { //generates a payment link
        return 'https://digital-ledger-rutvikkapade.herokuapp.com/payment?unique='+link;
    }
}