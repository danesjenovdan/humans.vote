var tokenContract = web3.eth.contract(AAAA);
web3.personal.unlockAccount("QQQQ", 'PPPP');
var contractData;
var token = tokenContract.new(
  "OOOO",
  {
    from:"QQQQ",
    data: "0xDDDD",
    gas: 1000000000
  }, function(e, contract){
    if(!e) {
	console.log(contract.transactionHash);
    }
})
