pragma solidity ^0.4.18;

import "../utils/PrivateOrg.sol";


contract MotionVotingOrganisationBroken is PrivateOrg {
    // Contract Variables and events
    string public organisationName;
    Motion[] public motions;
    uint public numberOfMotions;

    // STRUCTS
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
        int voteValue;
        bool isVotePositive;
        int numberOfVotes;
    }

    // vote "object" structure
    struct Vote {
        uint optionID;
        address voter;
    }
    
    // events
    event OrganisationNameChanged(string organisationName);
    event MotionAdded(uint motionID);
    event VoteSubmitted(uint voteID);
    event MotionResultCalculated(int result);

    /**
     * Constructor function
     * Needs _organisationName
     */
    function MotionVotingOrganisationBroken (
        string _organisationName
    ) public {
        // set voting rules at contract initialisation
        organisationName = _organisationName;
    }

    /**
     * Change organisation name
     * 
     * takes newOrganisationName
     * 
     * modified with onlyOwner
     */
    function changeOrganisationName(
        string newOrganisationName
    ) public onlyOwner {
        organisationName = newOrganisationName;

        // fire ChangeOfRules event
        OrganisationNameChanged(newOrganisationName);
    }

    function addBasicMotion(
        string _motionTitle,
        string _motionAbstract,
        uint _daysForDeliberation
    ) public onlyOwner {
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

        // fire event
        MotionAdded(motionID);
    }

    // function voteForMotion(uint _motionID, string _option) public onlyMembers {
    //     Motion storage m = motions[_motionID]; // get motion

    //     // user can only vote once
    //     require(!m.voted[msg.sender]); // If has already voted, cancel
    //     m.voted[msg.sender] = true; // Set this voter as having voted

    //     uint optionID = findOption(_motionID, _option); // get relevant option id

    //     // create vote
    //     uint voteID = m.votes.length++;
    //     Vote storage v = m.votes[voteID];
    //     v.optionID = optionID;
    //     v.voter = msg.sender;

    //     // increase number of votes
    //     Option storage o = m.options[optionID];
    //     o.numberOfVotes++;

    //     // fire event
    //     VoteSubmitted(voteID);
    // }

    function calculateMotionResult(uint _motionID) public onlyMembers {
        Motion storage m = motions[_motionID]; // get motion
        int motionResult = 0;

        for (uint i = 0; i < m.options.length; i++) {
            Option storage o = m.options[i];
            if (o.isVotePositive) {
                motionResult += o.numberOfVotes * o.voteValue;
            } else {
                motionResult -= o.numberOfVotes * o.voteValue;
            }
        }

        if (motionResult > 0) {
            m.motionPassed = true;
        }

        MotionResultCalculated(motionResult);
    }

    function addOption(uint motionID, string name, int voteValue, bool isVotePositive) private returns (uint optionID) {
        Motion storage m = motions[motionID]; // get Motion
        optionID = m.options.length++; // optionID is next option (autoincrement)
        Option storage o = m.options[optionID]; // get Option
        o.name = name;
        o.voteValue = voteValue;
        o.isVotePositive = isVotePositive;
        o.numberOfVotes = 0;

        m.numberOfOptions = optionID++; // increment number of proposals

        return optionID;
    }

    function findOption(uint _motionID, string _optionString) private view returns (uint optionIndex) {
        Motion storage m = motions[_motionID]; // get motion
        for (uint i = 0; i < m.options.length; i++) {
            Option storage o = m.options[i];
            string storage optionName = o.name;
            if (keccak256(optionName) == keccak256(_optionString)) {
                return i;
            }

        }
        return 404;
    }
    
}
