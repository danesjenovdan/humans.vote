pragma solidity ^0.4.18;

import "../utils/PrivateOrg.sol";


contract DemoVoting is PrivateOrg {
    // Contract Variables and events
    uint public minimumQuorum; // minimum quorum defined as an absolute number of voters
    int public majorityMargin; // the margin of necessary majority defined as an absolute number of voters
    Proposal[] public proposals; // dynamic array of Proposal objects
    uint public numProposals; // proposal counter

    // events (these are used for the app to subscribe to)
    event ProposalAdded(uint proposalID, string description); // a proposal has been added
    event Voted(uint proposalID, bool position, address voter, string justification); // someone voted
    // event ProposalTallied(uint proposalID, int result, uint quorum, bool active); // proposal votes have been counted
    event ChangeOfRules(uint newMinimumQuorum, int newMajorityMargin); // rules changed
    event ProposalResultAvailable(string proposalResult);

    // proposal "object" structure
    struct Proposal {
        string description;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        Vote[] votes; // dynamic array of Vote objects
        mapping (address => bool) voted; // mapping of addresses to store who voted
        uint votesFor;
        uint votesAgainst;
    }

    // vote "object" structure
    struct Vote {
        bool inSupport; // is the vote for or against?
        address voter; // who voted
        string justification; // justification string
    }

    /**
     * Constructor function
     * Needs minimumQuorumForProposals, marginOfVotesForMajority
     */
    function DemoVoting (
        uint minimumQuorumForProposals,
        int marginOfVotesForMajority
    ) public {
        // set voting rules at contract initialisation
        changeVotingRules(minimumQuorumForProposals, marginOfVotesForMajority);
    }

    /**
     * Change voting rules
     *
     * have at least `minimumQuorumForProposals` votes, and have 50% + `marginOfVotesForMajority` votes to be executed
     *
     * @param minimumQuorumForProposals how many members must vote on a proposal for it to be executed
     * @param marginOfVotesForMajority the proposal needs to have 50% plus this number
     *
     * modified with onlyOwner
     */
    function changeVotingRules(
        uint minimumQuorumForProposals,
        int marginOfVotesForMajority
    ) public onlyOwner {
        minimumQuorum = minimumQuorumForProposals;
        majorityMargin = marginOfVotesForMajority;

        // fire ChangeOfRules event
        ChangeOfRules(minimumQuorum, majorityMargin);
    }

    /**
     * Add Proposal
     *
     * Propose a text thing
     *
     * @param proposalText the text of the proposal
     *
     * modified by onlyMembers
     */
    function newProposal(string proposalText) public onlyMembers returns (uint proposalID) {
        proposalID = proposals.length++; // proposalID is next proposal (autoincrement)
        Proposal storage p = proposals[proposalID]; // get Proposal
        p.description = proposalText; // set proposalText
        p.proposalPassed = false; // didn't pass when created
        p.numberOfVotes = 0; // 0 votes when created
        ProposalAdded(proposalID, proposalText); // trigger ProposalAdded event
        numProposals = proposalID+1; // increment number of proposals

        return proposalID;
    }

    /**
     * Log a vote for a proposal
     *
     * Vote `supportsProposal? in support of : against` proposal #`proposalNumber`
     *
     * @param proposalNumber number of proposal
     * @param supportsProposal either in favor or against it
     * @param justificationText optional justification text
     *
     * modified by onlyMembers
     */
    function vote(
        uint proposalNumber,
        bool supportsProposal,
        string justificationText
    )
        public onlyMembers
        returns (uint voteID)
    {
        Proposal storage p = proposals[proposalNumber]; // Get the proposal
        require(!p.voted[msg.sender]); // If msg.sender has already voted, cancel
        p.voted[msg.sender] = true; // Set this voter as having voted
        p.numberOfVotes++; // Increase the number of votes
        if (supportsProposal) { // If they support the proposal
            p.currentResult++; // Increase score
            p.votesFor++;
        } else { // If they don't
            p.currentResult--; // Decrease the score
            p.votesAgainst++;
        }

        // Create a log of this event (emit so app can update)
        Voted(proposalNumber, supportsProposal, msg.sender, justificationText);
        return p.numberOfVotes;
    }

    function getNumberOfVotesForProposal(uint proposalNumber) public view returns (uint votesFor) {
        Proposal storage p = proposals[proposalNumber];
        
        return p.votesFor;
    }
    
    function getNumberOfVotesAgainstProposal(uint proposalNumber) public view returns (uint votesFor) {
        Proposal storage p = proposals[proposalNumber];
        
        return p.votesAgainst;
    }

    /**
     * Finish vote
     *
     * Count the votes proposal #`proposalNumber` and execute it if approved
     *
     * @param proposalNumber proposal number
     * 
     */
    function getProposalResults(uint proposalNumber) public {
        Proposal storage p = proposals[proposalNumber]; // get proposal

        require(p.numberOfVotes >= minimumQuorum); // and a minimum quorum has been reached...

        string memory proposalResult;

        // ...then execute result
        if (p.currentResult >= majorityMargin) {
            // Proposal passed
            p.proposalPassed = true;
            proposalResult = 'The proposal passed. Congrats!';
        } else {
            // Proposal failed
            p.proposalPassed = false;
            proposalResult = 'The proposal did not pass (yet).';
        }


        // Fire Events
        ProposalResultAvailable(proposalResult);
    }
}

