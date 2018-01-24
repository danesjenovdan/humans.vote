pragma solidity ^0.4.18;

import "../Organisation/Organisation.sol";


contract MotionVotingOrg is Organisation {
    // Contract Variables and events
    Motion[] public motions;
    uint public numberOfMotions;

    // motion "object structure
    struct Motion {
        string motionTitle;
        string motionAbstract;
        bool motionPassed;
        Option[] options;
        uint numberOfOptions;
        mapping (address => bool) voted;
        Vote[] votes;
        uint votingDeadline;
        uint minimumQuorum;
        uint majorityPercentage;
    }

    // option "object" structure
    struct Option {
        string name;
        uint voteValue;
        bool isVotePositive;
        uint numberOfVotes;
    }

    struct Vote {
        uint optionID;
        address voter;
    }

    /**
    * Constructor function
    * Needs minimumQuorumForProposals, minutesForDevate, marginOfVotesForMajority
    */
    function MotionVotingOrg (
    ) public {
        // initialise state
        numberOfMotions = 0;
    }

    function addMotion(
        string _motionTitle,
        string _motionAbstract,
        uint _votingDeadline,
        uint _minimumQuorum,
        uint _majorityPercentage
    ) public onlyOwner returns (uint _motionID) {
        uint motionID = motions.length++;
        Motion storage m = motions[motionID];

        m.motionTitle = _motionTitle;
        m.motionAbstract = _motionAbstract;
        m.numberOfOptions = 0;
        m.votingDeadline = _votingDeadline;
        m.minimumQuorum = _minimumQuorum;
        m.majorityPercentage = _majorityPercentage;

        numberOfMotions++;

        return motionID;
    }

    function addBasicMotion(
        string _motionTitle,
        string _motionAbstract,
        uint _daysForDeliberation
    ) public onlyOwner returns (uint _motionID) {
        uint motionID = motions.length++;
        Motion storage m = motions[motionID];

        m.motionTitle = _motionTitle;
        m.motionAbstract = _motionAbstract;
        m.numberOfOptions = 0;
        m.votingDeadline = _daysForDeliberation;
        m.minimumQuorum = 0;
        m.majorityPercentage = 51;

        addOption(motionID, "for", 1, true);
        addOption(motionID, "against", 1, false);
        addOption(motionID, "abstain", 0, true);

        numberOfMotions++;

        return motionID;
    }

    function getMotion(uint _motionID) public onlyMembers returns (string theTitle) {
        Motion storage m = motions[_motionID];

        return m.motionTitle;
    }

    function addOption(uint motionID, string name, uint voteValue, bool isVotePositive) public returns (uint optionID) {
        Motion storage m = motions[motionID]; // get Motion
        optionID = m.options.length++; // optionID is next option (autoincrement)
        Option storage o = m.options[optionID]; // get Option
        o.name = name;
        o.voteValue = voteValue;
        o.isVotePositive = isVotePositive;
        o.numberOfVotes = 0;

        m.numberOfOptions = optionID++; // increment number of proposals
    }

    function voteForMotion(uint _motionID, string _option) public onlyMembers returns (int _voteID) {
        Motion storage m = motions[_motionID]; // get motion
        uint optionID = findOption(_motionID, _option);

        uint voteID = m.votes.length++;
        Vote storage v = m.votes[voteID];

        v.optionID = optionID;
        v.voter = msg.sender;
    }

    function findOption(uint _motionID, string _optionString) returns (uint optionIndex) {
        Motion storage m = motions[_motionID]; // get motion
        for (uint i = 0; i < m.options.length; i++) {
            Option storage o = m.options[i];
            string storage optionName = o.name;
            if (keccak256(optionName) == keccak256(_optionString)) {
                return i;
            }

            return 404;
        }
    }

    // function voteForOption(uint optionID) public {
    //     require(!voted[msg.sender]); // If msg.sender has already voted, cancel
        
    //     Option storage o = options[optionID];
    //     voted[msg.sender] = true;
    //     o.numberOfVotes++;
    // }

    /**
    * Finish vote
    *
    * Count the votes proposal #`proposalNumber` and execute it if approved
    *
    * 
    */
    // function getMotionResult() public returns (bool motionPassed) {
    //     uint finalResult = 0;
    //     uint quorum;
    //     uint winningOption;
        
    //     for (uint i = 0; i < options.length; i++) {
    //         Option storage o = options[i]; // get option
    //         quorum = o.numberOfVotes + 1;

    //         if (o.isVotePositive) {
    //             finalResult += o.voteValue * o.numberOfVotes;
    //         } else {
    //             finalResult -= o.voteValue * o.numberOfVotes;
    //         }
    //     }


    //     require(minimumQuorum < quorum
    //         && now > votingDeadline); // TODO majority check

    //     // ...then execute result
    //     if (finalResult > 0) {
    //         motionPassed = true;
    //     } else {
    //         motionPassed = false;
    //     }

    //     return motionPassed;
    // }
}

