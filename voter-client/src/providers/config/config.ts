import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  contractsUrl = 'https://raw.githubusercontent.com/danesjenovdan/humans.vote/master/bin/contracts/';
  port: number = 8683;
  genesis: any = {};
  serverUrl: string = 'http://chain.humans.vote';
  demoWalletKey: string = '0x91099b87784687129a314094e8a5ff273f5d914a6c23413b714087ba5139cf4c';
  contractAddress: string;
  isAdmin: boolean = false;
  demoContracts = [
    {
      "hash": "0x537e9202989902b220f85624753e383887e57de456761328148379608b2f7e5e",
      "status": "MINED",
      "contractAddress": "0x9cEb71241dEFd7b1ac6CD96f6ba07cb628450B01",
      "abi": "[{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"proposals\",\"outputs\":[{\"name\":\"description\",\"type\":\"string\"},{\"name\":\"proposalPassed\",\"type\":\"bool\"},{\"name\":\"numberOfVotes\",\"type\":\"uint256\"},{\"name\":\"currentResult\",\"type\":\"int256\"},{\"name\":\"votesFor\",\"type\":\"uint256\"},{\"name\":\"votesAgainst\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"targetMember\",\"type\":\"address\"}],\"name\":\"removeMember\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"memberId\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"proposalNumber\",\"type\":\"uint256\"}],\"name\":\"getNumberOfVotesForProposal\",\"outputs\":[{\"name\":\"votesFor\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"numProposals\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"proposalText\",\"type\":\"string\"}],\"name\":\"newProposal\",\"outputs\":[{\"name\":\"proposalID\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"proposalNumber\",\"type\":\"uint256\"}],\"name\":\"getProposalResults\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"members\",\"outputs\":[{\"name\":\"member\",\"type\":\"address\"},{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"memberSince\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"proposalNumber\",\"type\":\"uint256\"}],\"name\":\"getNumberOfVotesAgainstProposal\",\"outputs\":[{\"name\":\"votesFor\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"minimumQuorum\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"majorityMargin\",\"outputs\":[{\"name\":\"\",\"type\":\"int256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"targetMember\",\"type\":\"address\"},{\"name\":\"memberName\",\"type\":\"string\"}],\"name\":\"addMember\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"proposalNumber\",\"type\":\"uint256\"},{\"name\":\"supportsProposal\",\"type\":\"bool\"},{\"name\":\"justificationText\",\"type\":\"string\"}],\"name\":\"vote\",\"outputs\":[{\"name\":\"voteID\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"minimumQuorumForProposals\",\"type\":\"uint256\"},{\"name\":\"marginOfVotesForMajority\",\"type\":\"int256\"}],\"name\":\"changeVotingRules\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"minimumQuorumForProposals\",\"type\":\"uint256\"},{\"name\":\"marginOfVotesForMajority\",\"type\":\"int256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"proposalID\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"description\",\"type\":\"string\"}],\"name\":\"ProposalAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"proposalID\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"position\",\"type\":\"bool\"},{\"indexed\":false,\"name\":\"voter\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"justification\",\"type\":\"string\"}],\"name\":\"Voted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"newMinimumQuorum\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"newMajorityMargin\",\"type\":\"int256\"}],\"name\":\"ChangeOfRules\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"proposalResult\",\"type\":\"string\"}],\"name\":\"ProposalResultAvailable\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"member\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"isMember\",\"type\":\"bool\"}],\"name\":\"MembershipChanged\",\"type\":\"event\"}]",
      "name": "DemoVoting"
    }
  ];
  provider = {
    url: '',
    chainId: 8692,
    name: 'humansvote',
  };

  constructor() {

  }

}
