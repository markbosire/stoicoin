"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const nodeAddress = uuidv4().split("-").join("");
const blockchain = require("./blockchain");
const bitcoin = new blockchain();
const cors = require("cors");
const rp = require("request-promise");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.argv[2];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: "*",
}));
const north = [
    { latitude: "31.791702", longitude: "-7.092620" },
    { latitude: "36.752887", longitude: "3.042048" },
    { latitude: "36.838140", longitude: "10.325760" },
    { latitude: "33.886917", longitude: "9.537499" },
    { latitude: "34.044857", longitude: "-5.007382" },
    { latitude: "35.793393", longitude: "-5.809856" },
    { latitude: "36.825170", longitude: "10.181245" },
    { latitude: "30.462030", longitude: "9.619239" },
    { latitude: "35.237005", longitude: "-1.642999" },
    { latitude: "32.375352", longitude: "-6.349910" }, // Fez, Morocco
];
const west = [
    { latitude: "9.05785", longitude: "7.49508" },
    { latitude: "14.693700", longitude: "-17.444060" },
    { latitude: "9.934739", longitude: "-9.698855" },
    { latitude: "6.310556", longitude: "-10.804722" },
    { latitude: "13.505676", longitude: "-15.255118" },
    { latitude: "5.556020", longitude: "-0.196810" },
    { latitude: "6.165187", longitude: "1.231605" },
    { latitude: "6.130344", longitude: "1.222191" },
    { latitude: "8.484444", longitude: "-13.234444" },
    { latitude: "6.364619", longitude: "2.418746" }, // Porto-Novo, Benin
];
const east = [
    { latitude: "1.292068", longitude: "36.821946" },
    { latitude: "9.018014", longitude: "38.746452" },
    { latitude: "0.317713", longitude: "32.582520" },
    { latitude: "-1.947520", longitude: "30.058670" },
    { latitude: "-6.792354", longitude: "39.208328" },
    { latitude: "1.954577", longitude: "30.089119" },
    { latitude: "-3.373056", longitude: "29.918886" },
    { latitude: "-1.957594", longitude: "30.060530" },
    { latitude: "-6.177395", longitude: "35.749845" },
    { latitude: "1.481855", longitude: "32.463708" }, // Jinja, Uganda
];
const south = [
    { latitude: "-33.924868", longitude: "18.424055" },
    { latitude: "-29.858680", longitude: "31.021840" },
    { latitude: "-26.204103", longitude: "28.047305" },
    { latitude: "-33.918861", longitude: "25.570553" },
    { latitude: "-33.310629", longitude: "26.525594" },
    { latitude: "-29.120040", longitude: "26.219070" },
    { latitude: "-34.036272", longitude: "23.047926" },
    { latitude: "-28.732260", longitude: "24.762320" },
    { latitude: "-29.515270", longitude: "30.223910" },
    { latitude: "-33.964960", longitude: "25.611910" }, // Uitenhage, South Africa
];
const central = [
    { latitude: "4.394676", longitude: "18.558190" },
    { latitude: "3.848032", longitude: "11.502075" },
    { latitude: "11.862560", longitude: "15.596390" },
    { latitude: "2.046934", longitude: "45.318160" },
    { latitude: "9.557270", longitude: "44.062790" },
    { latitude: "1.283330", longitude: "32.416668" },
    { latitude: "4.058586", longitude: "9.747113" },
    { latitude: "0.383328", longitude: "9.450000" },
    { latitude: "3.838005", longitude: "13.153294" },
    { latitude: "4.960270", longitude: "9.704280" }, // Buea, Cameroon
];
function getRandomLocation(locations) {
    return locations[Math.floor(Math.random() * locations.length)];
}
let portLocations = {
    "3001": getRandomLocation(north),
    "3002": getRandomLocation(west),
    "3003": getRandomLocation(east),
    "3004": getRandomLocation(south),
    "3005": getRandomLocation(central),
};
var latitude = "";
var longitude = "";
app.get("/blockchain", (req, res) => {
    res.send(bitcoin);
});
app.post("/transaction", (req, res) => {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
    res.json({ note: ` Transaction will be added in block ${blockIndex}. ` });
});
app.post("/transaction/broadcast", (req, res) => {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransaction(newTransaction);
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach((netWorkNodeUrl) => {
        const requestOptions = {
            uri: netWorkNodeUrl + "/transaction",
            method: "POST",
            body: newTransaction,
            json: true,
        };
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises).then((data) => {
        res.json({ note: ` Transaction created and broadcast succesful` });
    });
});
app.get("/mine", (req, res) => {
    latitude =
        port === "3001"
            ? north[Math.floor(Math.random() * north.length)].latitude
            : port === "3002"
                ? south[Math.floor(Math.random() * north.length)].latitude
                : port === "3003"
                    ? east[Math.floor(Math.random() * north.length)].latitude
                    : port === "3004"
                        ? west[Math.floor(Math.random() * north.length)].latitude
                        : central[Math.floor(Math.random() * north.length)].latitude;
    longitude =
        port === "3001"
            ? north[Math.floor(Math.random() * north.length)].longitude
            : port === "3002"
                ? south[Math.floor(Math.random() * north.length)].longitude
                : port === "3003"
                    ? east[Math.floor(Math.random() * north.length)].longitude
                    : port === "3004"
                        ? west[Math.floor(Math.random() * north.length)].longitude
                        : central[Math.floor(Math.random() * north.length)].longitude;
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockhash = lastBlock["hash"];
    const currentBlockData = {
        transactions: bitcoin.newTransactions,
        index: lastBlock["index"] + 1,
    };
    const nonce = bitcoin.proofOfWork(previousBlockhash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockhash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockhash, blockHash, latitude, longitude);
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach((netWorkNodeUrl) => {
        const requestOptions = {
            uri: netWorkNodeUrl + "/receive-new-block",
            method: "POST",
            body: { newBlock: newBlock },
            json: true,
        };
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises)
        .then((data) => {
        const requestOptions = {
            uri: bitcoin.currentNodeUrl + "/transaction/broadcast",
            method: "POST",
            body: { amount: 25, sender: "00", recipient: nodeAddress },
            json: true,
        };
        return rp(requestOptions);
    })
        .then((data) => {
        res.json({
            note: "New block mined and broadcast successfully",
            block: newBlock,
        });
    });
});
app.post("/receive-new-block", (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash == newBlock.previousBlockHash;
    const correctIndex = lastBlock["index"] + 1 === newBlock["index"];
    if (correctIndex && correctHash) {
        bitcoin.chain.push(newBlock);
        bitcoin.newTransactions = [];
        res.json({
            note: "New block registered succesfully",
            newBlock: newBlock,
        });
    }
    else {
        res.json({ note: "New block rejected", newBlock: newBlock });
    }
});
app.post("/register-and-broadcast-node", (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach((netWorkNodeUrl) => {
        const requestOptions = {
            uri: netWorkNodeUrl + "/register-node",
            method: "POST",
            body: { newNodeUrl: newNodeUrl },
            json: true,
        };
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises)
        .then((data) => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + "/register-nodes-bulk",
            method: "POST",
            body: {
                allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
            },
            json: true,
        };
        return rp(bulkRegisterOptions);
    })
        .then((data) => {
        res.json({ note: "New Node registered with network succesfully" });
    });
});
app.post("/register-node", (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    res.json({ note: "New node registered succesfully" });
});
app.get("/consensus", (req, res) => {
    const requestPromises = [];
    bitcoin.networkNodes.forEach((netWorkNodeUrl) => {
        const requestOptions = {
            uri: netWorkNodeUrl + "/blockchain",
            method: "GET",
            json: true,
        };
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises).then((blockchains) => {
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;
        blockchains.forEach((blockchain) => {
            if (blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.newTransactions;
            }
        });
        if (!newLongestChain ||
            (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
            res.json({ note: "chain not replaced", chain: bitcoin.chain });
        }
        else {
            bitcoin.chain = newLongestChain;
            bitcoin.newTransactions = newPendingTransactions;
            res.json({ note: "chain replaced", chain: bitcoin.chain });
        }
    });
});
app.post("/register-nodes-bulk", (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach((networkNodeUrl) => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) {
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    });
    res.json({ note: "Bulk registration succesfully" });
});
app.get("/block/:blockHash", (req, res) => {
    const getblock = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(getblock);
    res.json({ block: correctBlock });
});
app.get("/transaction/:transactionId", (req, res) => {
    const getblock = req.params.transactionId;
    const correctBlock = bitcoin.getTransaction(getblock);
    res.json({
        transaction: correctBlock["transaction"],
        block: correctBlock["block"],
    });
});
app.get("/address/:address", (req, res) => {
    const addressBlock = req.params.address;
    const addressData = bitcoin.getAddress(addressBlock);
    res.json({
        addressData: addressData,
    });
});
app.get("/block-explorer", function (req, res) {
    res.sendFile("./block-explorer/index.html", { root: __dirname });
});
app.listen(port, () => {
    console.log(`[server]: Server now running at http://localhost:${port}`);
});
