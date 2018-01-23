pragma solidity ^0.4.18;

import "../Organisation/Organisation.sol";


contract Demo is Organisation {
    // Contract Variables and events
    uint public minimumQuorum; // minimum quorum defined as an absolute number of voters
    uint public debatingPeriodInMinutes;
    int public majorityMargin; // the margin of necessary majority defined as an absolute number of voters
    Proposal[] public proposals; // dynamic array of Proposal objects
    uint public numProposals; // proposal counter

    // events (these are used for the app to subscribe to)
    event ProposalAdded(uint proposalID, string description); // a proposal has been added
    event Voted(uint proposalID, bool position, address voter, string justification); // someone voted
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active); // proposal votes have been counted
    event ChangeOfRules(uint newMinimumQuorum, uint newDebatingPeriodInMinutes, int newMajorityMargin); // rules changed

    // proposal "object" structure
    struct Proposal {
        string description;
        uint votingDeadline;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        Vote[] votes; // dynamic array of Vote objects
        mapping (address => bool) voted; // mapping of addresses to store who voted
    }

    // vote "object" structure
    struct Vote {
        bool inSupport; // is the vote for or against?
        address voter; // who voted
        string justification; // justification string
    }

    /**
     * Constructor function
     * Needs minimumQuorumForProposals, minutesForDevate, marginOfVotesForMajority
     */
    function Demo (
        uint minimumQuorumForProposals,
        uint minutesForDebate,
        int marginOfVotesForMajority
    ) public {
        // set voting rules at contract initialisation
        changeVotingRules(minimumQuorumForProposals, minutesForDebate, marginOfVotesForMajority);
    }

    /**
     * Change voting rules
     *
     * Make so that proposals need to be discussed for at least `minutesForDebate/60` hours,
     * have at least `minimumQuorumForProposals` votes, and have 50% + `marginOfVotesForMajority` votes to be executed
     *
     * @param minimumQuorumForProposals how many members must vote on a proposal for it to be executed
     * @param minutesForDebate the minimum amount of delay between when a proposal is made and when it can be executed
     * @param marginOfVotesForMajority the proposal needs to have 50% plus this number
     *
     * modified with onlyOwner
     */
    function changeVotingRules(
        uint minimumQuorumForProposals,
        uint minutesForDebate,
        int marginOfVotesForMajority
    ) public onlyOwner {
        minimumQuorum = minimumQuorumForProposals;
        debatingPeriodInMinutes = minutesForDebate;
        majorityMargin = marginOfVotesForMajority;

        // fire ChangeOfRules event
        ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
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
        p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes; // set debating period
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
        } else { // If they don't
            p.currentResult--; // Decrease the score
        }

        // Create a log of this event (emit so app can update)
        Voted(proposalNumber, supportsProposal, msg.sender, justificationText);
        return p.numberOfVotes;
    }

    /**
     * Finish vote
     *
     * Count the votes proposal #`proposalNumber` and execute it if approved
     *
     * @param proposalNumber proposal number
     * 
     */
    function getProposalResults(uint proposalNumber) public returns (bool proposalPassed) {
        Proposal storage p = proposals[proposalNumber]; // get proposal

        require(now > p.votingDeadline // If it is past the voting deadline
            && p.numberOfVotes >= minimumQuorum); // and a minimum quorum has been reached...

        // ...then execute result
        if (p.currentResult > majorityMargin) {
            // Proposal passed
            p.proposalPassed = true;
        } else {
            // Proposal failed
            p.proposalPassed = false;
        }

        // Fire Events
        ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
        return p.proposalPassed;
    }
}

