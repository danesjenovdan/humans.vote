var transaction = eth.getTransactionReceipt("TTTT");
var contractAddress = transaction.contractAddress;
console.log(contractAddress);
personal.unlockAccount("QQQQ", "PPPP");
var contract = eth.contract(AAAA).at(contractAddress);
contract.transferOwnership.sendTransaction("RRRR", {from: "QQQQ"})
