pragma solidity ^0.4.18;

import "../utils/PrivateOrg.sol";
import "../utils/Motion.sol";


contract MotionVotingOrganisation is PrivateOrg {
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

    /**
     * Constructor function
     * Needs _organisationName
     */
    function MotionVotingOrganisation (
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
    
}
