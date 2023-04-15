"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sha256 = require("sha256");
const currentNodeUrl = process.argv[3];
const { v4: uuidv4 } = require("uuid");
class Blockchain {
    constructor() {
        this.chain = [];
        this.newTransactions = [];
        this.currentNodeUrl = currentNodeUrl;
        this.createNewBlock(100, "0", "0", "", "");
        this.networkNodes = [];
    }
    createNewBlock(nonce, previousBlockHash, hash, latitude, longitude) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            latitude: latitude,
            longitude: longitude,
            transactions: this.newTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash,
        };
        this.newTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    }
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
            transactionId: uuidv4().split("-").join(""),
        };
        return newTransaction;
    }
    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash;
    }
    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== "0000") {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
        return nonce;
    }
    addTransactionToPendingTransaction(transObj) {
        this.newTransactions.push(transObj);
        return this.getLastBlock()["index"] + 1;
    }
    chainIsValid(blockchain) {
        let validChain = true;
        for (var i = 1; i < blockchain.length; i++) {
            const currentBlockchain = blockchain[i];
            const previousBlockchain = blockchain[i - 1];
            const blockHash = this.hashBlock(previousBlockchain["hash"], {
                transactions: currentBlockchain["transactions"],
                index: currentBlockchain["index"],
            }, currentBlockchain["nonce"]);
            if (blockHash.substring(0, 4) !== "0000")
                validChain;
            if (currentBlockchain["previousBlockHash"] !== previousBlockchain["hash"]) {
                validChain = false;
            }
        }
        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock["nonce"] === 100;
        const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
        const correctHash = genesisBlock["hash"] === "0";
        const correctTransactions = genesisBlock["transactions"].length === 0;
        if (!correctNonce ||
            !correctPreviousBlockHash ||
            !correctHash ||
            !correctTransactions) {
            validChain = false;
        }
        return validChain;
    }
    getBlock(blockHash) {
        let correctBlock = null;
        this.chain.forEach((block) => {
            if (block.hash === blockHash)
                correctBlock = block;
        });
        return correctBlock;
    }
    getTransaction(transactionID) {
        let correctTransaction = null;
        let correctBlock = null;
        this.chain.forEach((block) => {
            block.transactions.forEach((transaction) => {
                if (transaction.transactionId === transactionID) {
                    correctTransaction = transaction;
                    correctBlock = block;
                }
            });
        });
        return { transaction: correctTransaction, block: correctBlock };
    }
    getAddress(theaddress) {
        let addressChain = [];
        let x = null;
        this.chain.forEach((block) => {
            block.transactions.forEach((transaction) => {
                if (transaction.recipient === theaddress ||
                    transaction.sender === theaddress)
                    addressChain.push(transaction);
            });
        });
        let balance = 0;
        addressChain.forEach((chain) => {
            if (chain.recipient == theaddress)
                balance += chain.amount;
            if (chain.sender == theaddress)
                balance -= chain.amount;
        });
        return { transactions: addressChain, balance: balance };
    }
}
module.exports = Blockchain;
