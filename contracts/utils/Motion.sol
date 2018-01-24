pragma solidity ^0.4.18;


contract Motion {
    // Contract Variables and events
    uint public minimumQuorum; // minimum quorum defined as an absolute number of voters
    uint public debatingPeriodInMinutes;
    int public majorityPercentage; // required majority expressed as percentage
    string public motionTitle;
    string public motionAbstract;
    bool public motionPassed; // did the motion pass?
    Option[] public options; // dynamic array of options
    uint public numberOfOptions; // options counter
    mapping (address => bool) public voted; // mapping of addresses to store who voted
    Vote[] public votes; // dynamic array of votes
    uint votingDeadline; // voting deadline

    // option "object" structure
    struct Option {
        string name;
        uint voteValue;
        bool isVotePositive;
        uint numberOfVotes;
    }

    struct Vote {
        int optionID;
        address voter;
    }

    /**
     * Constructor function
     * Needs minimumQuorumForProposals, minutesForDevate, marginOfVotesForMajority
     */
    function Motion (
        uint _minimumQuorumForProposals,
        uint _minutesForDebate,
        int _majorityPercentage,
        string _motionTitle,
        string _motionAbstract
    ) public {
        // initialise state
        motionPassed = false;
        motionTitle = _motionTitle;
        motionAbstract = _motionAbstract;
        debatingPeriodInMinutes = _minutesForDebate;
        votingDeadline = now + _minutesForDebate * 1 minutes;

        // set voting rules at contract initialisation
        changeVotingRules(_minimumQuorumForProposals, _majorityPercentage);
    }

    /**
     * Change voting rules
     *
     *
     */
    function changeVotingRules(
        uint minimumQuorumForProposals,
        int percentageOfVotesForMajority
    ) public {
        minimumQuorum = minimumQuorumForProposals;
        majorityPercentage = percentageOfVotesForMajority;

        // fire ChangeOfRules event
        // ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
    }

    function newOption(string name, uint voteValue, bool isVotePositive) public returns (uint optionID) {
        optionID = options.length++; // optionID is next option (autoincrement)
        Option storage o = options[optionID]; // get Option
        o.name = name;
        o.voteValue = voteValue;
        o.isVotePositive = isVotePositive;
        o.numberOfVotes = 0;

        numberOfOptions = optionID++; // increment number of proposals
    }

    function voteForOption(uint optionID) public {
        require(!voted[msg.sender]); // If msg.sender has already voted, cancel
        
        Option storage o = options[optionID];
        voted[msg.sender] = true;
        o.numberOfVotes++;
    }

    /**
     * Finish vote
     *
     * Count the votes proposal #`proposalNumber` and execute it if approved
     *
     * 
     */
    function getMotionResult() public returns (bool motionPassed) {
        uint finalResult = 0;
        uint quorum;
        uint winningOption;
        
        for (uint i = 0; i < options.length; i++) {
            Option storage o = options[i]; // get option
            quorum = o.numberOfVotes + 1;

            if (o.isVotePositive) {
                finalResult += o.voteValue * o.numberOfVotes;
            } else {
                finalResult -= o.voteValue * o.numberOfVotes;
            }
        }


        require(minimumQuorum < quorum
            && now > votingDeadline); // TODO majority check

        // ...then execute result
        if (finalResult > 0) {
            motionPassed = true;
        } else {
            motionPassed = false;
        }

        return motionPassed;
    }
}

