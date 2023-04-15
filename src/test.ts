const blockchain = require("./blockchain");
const bitcoin = new blockchain();
const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1676446561679,
      transactions: [],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0",
    },
    {
      index: 2,
      timestamp: 1676447997972,
      transactions: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb903b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0",
    },
    {
      index: 3,
      timestamp: 1676448002453,
      transactions: [
        {
          amount: 25,
          sender: "0",
          transactionId: "72427193b70b4363b51518cd50a002f6",
        },
      ],
      nonce: 176131,
      hash: "0000bb482e8962d241a2bdcdb8ec7c7ea42c0f73e29b1d0068147c4fbe628a94",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 4,
      timestamp: 1676448153068,
      transactions: [
        {
          amount: 25,
          sender: "00",
          transactionId: "e8f83a537f564881b0da2853422a6aa8",
        },
        {
          amount: 10,
          sender: "QWERTYUIOLMNBV",
          transactionId: "24c6987890234df89f6c7ae61b86e174",
        },
        {
          amount: 105,
          sender: "QWERTYUIOLMNBV",
          transactionId: "7b7214ddbb104e6dba952ef23356ddb4",
        },
        {
          amount: 305,
          sender: "QWERTYUIOLMNBV",
          transactionId: "71aec7c762c349ff9d004f5a10a68bc0",
        },
        {
          amount: 405,
          sender: "QWERTYUIOLMNBV",
          transactionId: "3461f96386b44d04afadfc6f8af1fed0",
        },
      ],
      nonce: 81729,
      hash: "0000a32ac154b1d23f0293cc90fec4f6a7a68c37f0aeb21b6986a38f4ac5791d",
      previousBlockHash:
        "0000bb482e8962d241a2bdcdb8ec7c7ea42c0f73e29b1d0068147c4fbe628a94",
    },
  ],
  newTransactions: [
    {
      amount: 25,
      sender: "00",
      transactionId: "58726425292b47b6bfbf1465f0a32835",
    },
  ],
  currentNodeUrl: "http://localhost:3003",
  networkNodes: [],
};
console.log(bitcoin.chainIsValid(bc1.chain));
