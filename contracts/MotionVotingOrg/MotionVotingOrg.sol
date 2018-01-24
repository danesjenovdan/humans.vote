pragma solidity ^0.4.18;

import "../utils/PrivateOrg.sol";


contract MotionVotingOrg is PrivateOrg {
    // Contract Variables and events
    string public organisationName;
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
        int voteValue;
        bool isVotePositive;
        int numberOfVotes;
    }

    struct Vote {
        uint optionID;
        address voter;
    }

    // events
    event OrganisationNameChanged(string organisationName);

    /**
    * Constructor function
    * Needs minimumQuorumForProposals, minutesForDevate, marginOfVotesForMajority
    */
    function MotionVotingOrg (string _organisationName) public {
        // initialise state
        numberOfMotions = 0;
        changeOrganisationName(_organisationName);
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

        // fire OrganisationNameChanged event
        OrganisationNameChanged(newOrganisationName);
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

    function getMotionResult(uint _motionID) public constant onlyMembers returns (bool theresult) {
        Motion storage m = motions[_motionID];
        return m.motionPassed;
    }

    function getMotionTitle(uint _motionID) public constant onlyMembers returns (string theTitle) {
        Motion storage m = motions[_motionID];
        return m.motionTitle;
    }

    function getMotionAbstract(uint _motionID) public constant onlyMembers returns (string theAbstract) {
        Motion storage m = motions[_motionID];
        return m.motionAbstract;
    }

    function getMotionVotesFor(uint _motionID) public constant onlyMembers returns (int votesFor) {
        Motion storage m = motions[_motionID];
        uint optionID = findOption(_motionID, "for"); // get relevant option id

        Option storage o = m.options[optionID];

        return o.numberOfVotes;
    }

    function calculateMotionResult(uint _motionID) public constant onlyMembers returns (int theResult) {
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

        return motionResult;
    }

    function voteForMotion(uint _motionID, string _option) public onlyMembers returns (uint _voteID) {
        Motion storage m = motions[_motionID]; // get motion

        // user can only vote once
        require(!m.voted[msg.sender]); // If has already voted, cancel
        m.voted[msg.sender] = true; // Set this voter as having voted

        uint optionID = findOption(_motionID, _option); // get relevant option id

        // create vote
        uint voteID = m.votes.length++;
        Vote storage v = m.votes[voteID];
        v.optionID = optionID;
        v.voter = msg.sender;

        // increase number of votes
        Option storage o = m.options[optionID];
        o.numberOfVotes++;

        return voteID;
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
    }

    function findOption(uint _motionID, string _optionString) private returns (uint optionIndex) {
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

